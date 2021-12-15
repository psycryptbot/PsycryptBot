//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

// TODO: Implement GraphQL interface with UniswapV2
// TODO: Move `calculateRatio` `determineAddress` implementations
const BaseExchange = require('./shims/BaseExchange');

/**
 *  The class that will interface with the uniswapv2 exchange protocol
 *
 * @class UniswapExchangeV2
 * @extends {BaseExchange}
 */
class UniswapExchangeV2 extends BaseExchange {
  /**
   * Creates an instance of UniswapExchange.
   *
   * @memberof UniswapExchangeV2
   */
  constructor() {
    // Only one network is supported here, so we don't include network param
    super('uniswap-v2');
    this.tokenListUrl = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';
    this.tokenListName = 'uniswap_token_list';
    this.chain = this.data.chains.ethereumMain.values[0];
    this.exchange = this.data.chains.ethereumMain.exchanges.uniswapv2;
    this.endConstruction();
  }
}

module.exports = UniswapExchangeV2;
