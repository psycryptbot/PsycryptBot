//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

/*
  Control Flow
  -----------------
  1. Get a list of all the tokens on each exchange
  2. Merge all the token listings into one master list
  3. Iterate through every token on the master list
    1. Get a list of all the exchanges that have the token
    2. Compare token prices along each exchange
    -----(After first iteration in loop)-----
    3. Get pair address of current token and previous token
    4. Check reserves of each to see ratio
    5. Compare ratio to volume to determine if profitability
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
    const exchangeKeys = Object.keys(exchanges);
    let exchangeValues = Object.values(exchanges);
    for (let i = 0; i < exchangeKeys.length; i++) {
      const currentExchangeName = exchangeKeys[i];
      const CurrentExchangeClass = exchangeValues[i];
      this.exchanges[currentExchangeName] = new CurrentExchangeClass();
    }
    exchangeValues = Object.values(this.exchanges);
    this.adoptSubProcesses(exchangeValues);
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
            this.masterList[currentToken] = currentToken;
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
