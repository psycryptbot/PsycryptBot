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

/**
 * The executor of the arbitrage strategies provided
 * by the Arbitrage module
 *
 * @class Executor
 * @extends {Logger}
 */
class Executor extends Logger {
  /**
   * Creates an instance of Executor.
   *
   * @memberof Executor
   */
  constructor() {
    super('Executor');
    this.endConstruction();
  }
}

module.exports = Executor;
