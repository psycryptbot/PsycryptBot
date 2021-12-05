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
    super('Uniswap v2 Exchange');
    this.tokenListUrl = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';
    this.tokenListName = 'uniswap_token_list';
    this.chain = this.data.chains.ethereumMain.values[0];
    this.exchange = this.data.chains.ethereumMain.exchanges.uniswapv2;
    this.endConstruction();
  }

  /**
   * @inheritdoc
   * @override
   * @memberof UniswapExchangeV2
   */
  async getTokenList() {
    await this._updateTokenListIfNeeded();
    return this.tokenList;
  }

  /**
   * @inheritdoc
   * @override
   * @memberof UniswapExchangeV2
   */
  async getTokenPrice(token) {
    token = this.determineAddress(token);
    return this._useMoralisContextIfAvailable(async () => {
      return await this._getTokenPrice(token);
    }, null);
  }

  /**
   * @inheritdoc
   * @override
   * @memberof UniswapExchangeV2
   */
  async getTokenPairMetadata(token1, token2) {
    token1 = this.determineAddress(token1);
    token2 = this.determineAddress(token2);
    return this._useMoralisContextIfAvailable(async () => {
      return await this._getTokenPairMetadata([token1, token2]);
    }, null);
  }

  /**
   * @inheritdoc
   * @override
   * @memberof UniswapExchangeV2
   */
  async getTokenPairReserves(pairAddress) {
    return this._useMoralisContextIfAvailable(async () => {
      return await this._getPairReserves(pairAddress);
    });
  }

  /**
   * @inheritdoc
   * @override
   * @memberof UniswapExchangeV2
   */
  async calculateRatio(token1, token2, reserves) {
    token1 = this.determineAddress(token1);
    token2 = this.determineAddress(token2);
    const token1Amount = this.getTokenPrice(token1) * reserves.reserve1;
    const token2Amount = this.getTokenPrice(token2) * reserves.reserve2;
    return `${token1Amount}:${token2Amount}`;
  }

  /**
   * @inheritdoc
   * @override
   * @memberof UniswapExchangeV2
   */
  async determineAddress(token) {
    let ret = null;
    Object.values(this.tokenList.tokens).forEach((tokenVal) => {
      if (tokenVal.symbol == token) {
        ret = tokenVal.address;
      } else if (token == tokenVal.address) {
        ret = token;
      }
    });
    if (ret == null) {
      this.error(`Invalid token address or token symbol ${token}`);
    }
  }
}

module.exports = UniswapExchangeV2;
