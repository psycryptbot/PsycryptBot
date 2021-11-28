//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const Logger = require('../Logger');
const Executer = require('./Executor');
const Observer = require('./Observer');

/**
 * This class manages the arbirage section.
 * Basically it is the interface between the app and
 * discovery/execution of arbitrage stratigies.
 *
 * @class Arbitrage
 * @extends {Logger}
 */
class Arbitrage extends Logger {
  /**
   * Creates an instance of Arbitrage.
   * @memberof Arbitrage
   */
  constructor() {
    super('Arbitrage');
    this.executer = new Executer();
    this.observer = new Observer();
    this.adoptSubProcesses([this.executer, this.observer]);
    this.endContruction();
  }
}

module.exports = Arbitrage;
