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
 * The interface between the bot and the DEX's to monitor them
 *
 * @class Observer
 * @extends {Logger}
 */
class Observer extends Logger {
  /**
   * Creates an instance of Observer.
   * @memberof Observer
   */
  constructor() {
    super('Observer');
    this.events = new EventEmitter();
  }
}

module.exports = Observer;
