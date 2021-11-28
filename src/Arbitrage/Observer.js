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
const {EventEmitter} = require('events');
/**
 * Axios
 * WSS ethereum.getDefaultProvider ()
 * infura: https://blog.infura.io/getting-started-with-infura-28e41844cc89/
 * .on
 * https://github.com/6eer/uniswap-sushiswap-arbitrage-bot
 * https://0x.org/
 * https://0x.org/docs/api
 * https://chainprox.com/earn
 * https://docs.soliditylang.org/en/v0.5.4/control-structures.html#error-handling-assert-require-revert-and-exceptions
 */

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
    // this.restABI = new REST();
    this.events = new EventEmitter();
    // this.adoptSubProcesses([this.restABI]);
    this.endContruction();
  }
}

module.exports = Observer;
