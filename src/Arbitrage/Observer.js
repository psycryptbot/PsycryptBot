//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

// TODO: Move calculation logic into own functions or extensions.
// TODO: Document major logic within `executeObservationCycle`
// TODO: Update logging style for display purposes


const Logger = require('../Logger');
const exchanges = require('../Networking').exchanges;
const path = require('path');
const fs = require('fs');
const masterListPath = path.join(__dirname, './resources/master_list.json');

/**
 * The interface between the bot and the DEX's to monitor them
 *
 * @class Observer
 * @extends {Logger}
 */
class Observer extends Logger {
  /**
   * Creates an instance of Observer.
   *
   * @memberof Observer
   */
  constructor() {
    super('Observer');
    this.exchanges = {};
    this.lastCheckedToken = null;
    this.masterList = null;
    this.executeCacheItems = [];
    this.scannedData = {};
    for (const exchangeName of Object.keys(exchanges)) {
      this.exchanges[exchangeName] = new exchanges[exchangeName]();
    }
    this.adoptSubProcesses(Object.values(this.exchanges));
    this.endConstruction();
  }

  /**
   * Executes an observation cycle where all the exchanges are checked, and
   * arbitrage opportunities are saved + logged.
   *
   * @memberof Observer
   */
  async executeObservationCycle() {
    if (this.masterList == null) {
      await this.mergeTokenLists(); // Phase One
    }

    await this.preformTokenScan(); // Phase Two
    this.startDifferenceCalculation(this.scannedData); // Phase Three
    await this.startLBFLCalculations(); // Phase Four
  }


  /**
   * Preforms the scanning of the tokens in our masterlist
   * and curates all results in `this.scannedData`
   *
   * @memberof Observer
   */
  async preformTokenScan() {
    for (const tokenSymbol of Object.keys(this.masterList)) {
      const tokenData = this.masterList[tokenSymbol];

      this.debug(`Starting checks for token: ${tokenSymbol}`);

      if (tokenData.supportedExchanges.length > 1) {
      // eslint-disable-next-line max-len
        for (const exchange of this.getExchangesFromNames(tokenData.supportedExchanges)) {
          this.debug(`Checking on ${exchange._name}`);
          // Implement cache
          const scannedTokenData = this.scannedData[tokenSymbol];
          // eslint-disable-next-line max-len
          if (scannedTokenData == null || !scannedTokenData.exchanges[exchange._name]) {
            const initialData = scannedTokenData || {
              exchanges: {},
            };
            const tokenPrice = await exchange.getTokenPrice(tokenSymbol);
            if (tokenPrice == null) {
              // eslint-disable-next-line max-len
              this.debug(`Skipping token ${tokenSymbol} as unable to get price`);
              continue;
            }
            initialData.exchanges[exchange._name] = {
              tokenPrice: tokenPrice.usdPrice,
            };
            this.scannedData[tokenSymbol] = initialData;
          }
        }
      } else {
        this.debug(`Skipping ${tokenSymbol} as only one exchange supports it`);
        continue; // If we add more code later
      }
    }
  }

  /**
   * With scanned tokens in place we can start to calculate our
   * priority list for which tokens have a difference on which exchange
   *
   * @param {Dict} scannedData
   *    Data retrieved by some sort of scanning process
   *
   * @memberof Observer
   */
  startDifferenceCalculation(scannedData) {
    const sortedKeys = Object.keys(scannedData).sort();

    for (const tokenSymbol of sortedKeys) {
      const currentToken = this.scannedData[tokenSymbol];
      const len = Object.keys(currentToken.exchanges).length;

      if (len > 1) { // Sorta does nothing atm.
        const checkedPairs = [];

        for (let i = 1; i < len; i++) {
          const exchangeNames = Object.keys(currentToken.exchanges);
          const currentExchangeData = currentToken.exchanges[exchangeNames[i]];
          let currentExchangeName = exchangeNames[i];
          let nextExchangeName;
          let currentNamePairs;

          if (i == exchangeNames.length-1 && len >= 2) {
            nextExchangeName = exchangeNames[0];
            currentNamePairs = [
              currentExchangeName,
              nextExchangeName,
            ].sort();
          } else {
            nextExchangeName = exchangeNames[i + 1];
            let skip = false;
            currentNamePairs = [
              currentExchangeName,
              nextExchangeName,
            ].sort();
            checkedPairs.forEach((pair) => {
              if (skip == false) {
                skip = pair.every((name, idx) => {
                  return name == currentNamePairs[idx];
                });
              }
            });

            if (skip) {
              // TODO: Get this to trigger if it doesn't already do so
              this.debug(`Skipping duplicate calculation`);
              continue;
            }
          }

          checkedPairs.push(currentNamePairs);
          const nextExchangeData = currentToken.exchanges[nextExchangeName];


          /* eslint-disable */
          const biggerValue = Math.max(currentExchangeData.tokenPrice, nextExchangeData.tokenPrice);
          const smallerValue = Math.min(currentExchangeData.tokenPrice, nextExchangeData.tokenPrice);
          /* eslint-enable */

          // Correct the order (smaller --> bigger)
          if (biggerValue == currentExchangeData.tokenPrice) {
            const buffer = currentExchangeName;
            currentExchangeName = nextExchangeName;
            nextExchangeName = buffer;
          }

          // TODO: find a better alternative, calculate minimum difference
          if ((biggerValue - smallerValue) >= 20) {
            const executeCacheItem = {
              exchange1: currentExchangeName,
              exchange2: nextExchangeName,
              difference: biggerValue - smallerValue,
              token: tokenSymbol,
            };
            // eslint-disable-next-line max-len
            this.debug(`Difference (${executeCacheItem.token}) ${JSON.stringify(executeCacheItem, null, 2)}`);
            this.executeCacheItems.push(executeCacheItem);
          }
        }
      }
    }
  }

  /**
   * Starts calculating the optimal token to flashloan on behalf of both
   * exchanges. This is the "Liquidity Based FlashLoan" calculation.
   * This is pretty resource intensive, so if they could be calculated
   * by multiple bots, and aggregated later, that would be awesome.
   *
   * @memberof Observer
   */
  async startLBFLCalculations() {
    for (let i = 0; i < this.executeCacheItems.length;) {
      const cacheItem = this.executeCacheItems[i];
      // TODO: Find an exact token list for AAVE, for now assume any token works
      for (const tokenSymbol of Object.keys(this.masterList)) {
        const tokenData = this.masterList[tokenSymbol];
        if (
          tokenData.supportedExchanges.includes(cacheItem.exchange1) &&
          tokenData.supportedExchanges.includes(cacheItem.exchange2)
        ) {
          if (tokenSymbol == cacheItem.token) {
            continue;
          }
          // This is literally saving quite a bit of time
          const firstStepResult = await this.hasOptimalPairReserves(
              tokenSymbol,
              cacheItem.token,
              cacheItem.exchange1,
          );
          if (!firstStepResult) {
            this.debug(`Unusable: ${tokenSymbol}`);
            continue;
          }
          const secondStepResult = await this.hasOptimalPairReserves(
              cacheItem.token,
              tokenSymbol,
              cacheItem.exchange2,
          );
          if (!secondStepResult) {
            this.debug(`Unusable: ${tokenSymbol}`);
            continue;
          }
          // Seriously don't question my judgement

          const results = [
            firstStepResult,
            secondStepResult,
          ];

          let estimatedProfits = cacheItem.difference; // Not including gas

          for (const result of results) {
            estimatedProfits += result[0] - result[1];
          }

          // eslint-disable-next-line max-len
          this.debug(`Profits after using ${tokenSymbol} as flashloan token: ${estimatedProfits}`);

          if (estimatedProfits < 0) { // We need to factor gas prices
            this.debug(`Unusable: ${tokenSymbol}`);
            continue;
          }

          const info = {
            symbol: tokenSymbol,
            ratios: {
              firstRatio: firstStepResult,
              secondRatio: secondStepResult,
            },
          };

          if (this.executeCacheItems[i].flashLoanTokens == null) {
            this.executeCacheItems[i].flashLoanTokens = [info];
          } else {
            this.executeCacheItems[i].flashLoanTokens.push(info);
          }
          i++;
        }
      }
      if (this.executeCacheItems[i].flashLoanTokens == null) {
        this.executeCacheItems.splice(i, 1);
      }
    }
    if (this.executeCacheItems.length == 0) {
      this.debug(`Sad, no profitable combo's found`);
      return;
    }
    // eslint-disable-next-line max-len
    this.debug(`Found some very good profits: ${JSON.stringify(this.executeCacheItems, null, 2)}`);
    this.parent.executer.executeCache = this.executeCacheItems;
  }

  /**
   * Checks the conversion from token1 on exchange to token2 on the same
   * exchange. If the pair yeilds a loss we don't want it (will update later to
   * allow minor incursion of loss)
   *
   * @param {String} token1
   *    The token to turn into token2
   * @param {String} token2
   *    The destination token
   * @param {String} exchange
   *    The exchange to check the ratio of
   *
   * @return {Number|null} difference in the ratio in USD
   * @memberof Observer
   */
  async hasOptimalPairReserves(token1, token2, exchange) {
    // TODO: Check that these exist
    const _exchange = await this.getExchangesFromNames([exchange])[0];
    // eslint-disable-next-line max-len
    const reservesAddress = await _exchange.getTokenPairAddress(token1, token2);
    if (!reservesAddress) {
      return null;
    }
    // eslint-disable-next-line max-len
    const reserves = await _exchange.getTokenPairReserves(reservesAddress.pairAddress);
    if (!reserves) {
      return null;
    }
    const ratio = await _exchange.getRatio(token1, token2, reserves);
    this.debug(`Received ratio: ${ratio}`);
    return ratio;
  }

  /**
   * Sorts `this.exchanges` given a name.
   *
   * @param {Array<String>} names
   *    The names of the exchanges to extract
   *
   * @return {Array<BaseExchange?>}
   * @memberof Observer
   */
  getExchangesFromNames(names) {
    const ret = [];
    names = names.sort(); // More efficient hopefully
    const exchanges = this.exchanges;
    for (const name of names) {
      if (exchanges[name] != null) {
        ret.push(exchanges[name]);
      }
    }
    return ret;
  }

  /**
   * Merges all the lists together and writes to the master list
   * file if a new token was added.
   *
   * @memberof Observer
   */
  async mergeTokenLists() {
    // TODO: Skip this step if we trust our saved list
    this.masterList = {};
    for (const exchange of Object.values(this.exchanges)) {
      const list = await exchange.getList();
      for (const tokenInfo of list.tokens) {
        if (Object.keys(this.masterList).includes(tokenInfo.symbol)) {
          const currentToken = this.masterList[tokenInfo.symbol];
          if (!currentToken.supportedExchanges.includes(exchange._name)) {
            currentToken.supportedExchanges.push(exchange._name);
            this.masterList[tokenInfo.symbol] = currentToken;
          }
        } else {
          this.masterList[tokenInfo.symbol] = {
            supportedExchanges: [exchange._name],
          };
        }
      }
    }
    const stringified = JSON.stringify(this.masterList, null, 2);
    if (!fs.existsSync(masterListPath)) {
      fs.writeFileSync(masterListPath, stringified, {
        encoding: 'utf-8',
      });
    // eslint-disable-next-line max-len
    } else if (!(fs.readFileSync(masterListPath, {encoding: 'utf8'}) == stringified)) {
      fs.writeFileSync(masterListPath, stringified, {
        encoding: 'utf-8',
      });
    }
  }
}

module.exports = Observer;
