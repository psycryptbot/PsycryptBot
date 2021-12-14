//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//


// TODO: Move `calculateRatio` `determineAddress` implementations
const BaseExchange = require('./shims/BaseExchange');

/**
 *  The class that will interface with the sushiswap exchange protocol
 *
 * @class SushiswapExchange
 * @extends {BaseExchange}
 */
class SushiswapExchange extends BaseExchange {
  /**
   * Creates an instance of SushiswapExchange.
   *
   * @memberof SushiswapExchange
   */
  constructor() {
    // Only one network is supported here, so we don't include network param
    super('sushiswap');
    this.tokenListName = 'sushiswap_token_list';
    this.staticTokenList = true;
    this.chain = this.data.chains.ethereumMain.values[0];
    this.exchange = this.data.chains.ethereumMain.exchanges.sushiswap;
    this.endConstruction();
  }
}

module.exports = SushiswapExchange;
