//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const BaseExchange = require('./shims/BaseExchange');

/**
 *  The class that will interface with the uniswap exchange protocol
 *
 * @class UniswapExchange
 * @extends {BaseExchange}
 */
class UniswapExchange extends BaseExchange {
  /**
   * Creates an instance of UniswapExchange.
   *
   * @memberof UniswapExchange
   */
  constructor() {
    super('Uniswap Exchange');
  }
}

module.exports = UniswapExchange;
