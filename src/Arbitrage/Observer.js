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

/*
  Control Flow
  -----------------
  1. Get a list of all the tokens on each exchange
  2. Merge all the token listings into one master list
  3. Iterate through every token on the master list
    3.1. Get a list of all the exchanges that have the token
    3.2. Compare token prices along each exchange
    -----(After first iteration in loop)-----
    3.3. Get pair address of current token and previous token
    3.4. Check reserves of each to see ratio
    3.5. Compare ratio to volume to determine if profitability
      is assured
  4. Log out results, send notification to application and server
  5. Calculate gas for each positive result and estimate losses
  6. Start a distributed execution chain of all profitable transactions
*/

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
      await this.mergeTokenLists();
    }
    for (const tokenSymbol of Object.keys(this.masterList)) {
      const tokenData = this.masterList[tokenSymbol];

      this.debug(`Starting checks for token: ${tokenSymbol}`);

      if (tokenData.supportedExchanges.length > 1) {
      // eslint-disable-next-line max-len
        for (const exchange of this.getExchangeFromNames(tokenData.supportedExchanges)) {
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

    // Calculating
    const sortedKeys = Object.keys(this.scannedData).sort();

    for (const tokenSymbol of sortedKeys) {
      this.debug(`Calculating token ${tokenSymbol}`);
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
            };
            this.parent.executer.executeCache.push(executeCacheItem);
            // eslint-disable-next-line max-len
            this.debug(`Found difference in prices! (${currentExchangeName}/${nextExchangeName}): ${JSON.stringify(executeCacheItem, null, 2)}`);
          }
        }
      }
    }
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
  getExchangeFromNames(names) {
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
