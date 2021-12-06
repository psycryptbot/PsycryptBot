//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

/* eslint-disable max-len */

// TODO: Use process.psycrypt.config for environment information
// TODO: Make the server URL get setup during bot setup as dynamic
// TODO: Write shorthand for random values in MoralisData

const {REST} = require('../../internal');
const Moralis = require('moralis/node');
const MoralisData = require('./MoralisData.json');

/**
 * The interface for the Moralis sandboxing the features that we use
 * from unneeded garbage. We use their Web3 api for monitoring purposes
 * NOTE: One time construction ONLY! Moralis is weird and self-implements
 * states and connections. We basically have to wrap their functions
 * with our logger.
 *
 * @class MoralisInterface
 * @extends {REST}
 */
class MoralisInterface extends REST {
  /**
   * Creates an instance of MoralisInterface.
   *
   * @param {String} name
   * @memberof MoralisInterface
   */
  constructor(name) {
    super(name);
    this.data = MoralisData;
    this.chain = ''; // this.data.chains.ethereumMain.values[0];
    this.exchange = ''; // this.data.chains.ethereumMain.exchanges.uniswapv3;
    this.rateLimit = 3000; // 3k Requests
    this.rateLimitResetInterval = 60000; // Per minute
    Moralis.start({
      serverUrl: process.env.MORALIS_SERVER_URL,
      appId: process.env.MORALIS_API_KEY,
    });
  }

  /**
   * Gets the token metadata given one or more addresses
   *
   * @param {String|Array<String>} addresses
   *    And array or string representing the token to get the metadata of.
   * @param {String?} chain
   *    The blockchain containing the required information
   *
   * @return {Array<Dict>}
   * @requestWeight `1` Request
   * @memberof MoralisInterface
   */
  async _getTokenMetadata(addresses, chain = this.chain) {
    return await this.rateLimitedExecution(1, async () => {
      this.debug(`Getting token metadata from address(es): ${addresses}`);
      const ret = await Moralis.Web3API.token.getTokenMetadata({
        chain: chain,
        addresses: addresses,
      }).catch((reason) => {
        this._handleMessage(reason);
      });
      if (ret != null) {
        this.debug(`Received metadata: ${JSON.stringify(ret, null, 2)}`);
      }
      return ret;
    });
  }

  /**
   * Gets the token metadata given one or more token symbols
   *
   * @param {String|Array<String>} symbols
   *    The token symbol to get the metadata from
   * @param {String?} chain
   *    The blockchain containing the required information
   *
   * @return {Array<Dict>} The response data
   * @requestWeight `1` Request
   * @memberof MoralisInterface
   */
  async _getMetadataBySymbol(symbols, chain = this.chain) {
    return await this.rateLimitedExecution(1, async () => {
      this.debug(`Getting token metadata from symbols(s): ${symbols}`);
      const ret = await Moralis.Web3API.token.getTokenMetadata({
        chain: chain,
        addresses: symbols,
      }).catch((reason) => {
        this._handleMessage(reason);
      });
      if (ret != null) {
        this.debug(`Received metadata: ${JSON.stringify(ret, null, 2)}`);
      }
      return ret;
    });
  }

  /**
   * Gets a token allowance (not much else to say)
   *
   * @param {String} ownerAddress
   *    The owner address we're checking the token allowance of
   * @param {String} spenderAddress
   *    The spender, which should have access to the token from the owner
   * @param {String} tokenAddress
   *    The actual token we are looking for on the owner
   *
   * @requestWeight `1` Request
   * @return {Dict} The response data
   * @memberof MoralisInterface
   */
  async _getTokenAllowance(ownerAddress, spenderAddress, tokenAddress) {
    return await this.rateLimitedExecution(1, async () => {
      this.debug(`Getting allowance of ${ownerAddress} from ${spenderAddress} in token: ${tokenAddress}`);
      const ret = await Moralis.Web3API.token.getTokenAllowance({
        owner_address: ownerAddress,
        spender_address: spenderAddress,
        address: tokenAddress,
      }).catch((reason) => {
        this._handleMessage(reason);
      });
      if (ret != null) {
        this.debug(`Received allowance: ${JSON.stringify(ret, null, 2)}`);
      }
      return ret;
    });
  }

  /**
   * Gets a token price given an address, exchange, and chain.
   *
   * @param {String} tokenAddress
   *    The token address to get the price of
   * @param {String} exchange
   *    The exchange we'll contact for the price
   * @param {String?} chain
   *    The blockchain containing the required information
   *
   * @requestWeight `3` Requests
   * @return {Dict} The response data
   * @memberof MoralisInterface
   */
  async _getTokenPrice(tokenAddress, exchange = this.exchange, chain = this.chain) {
    return await this.rateLimitedExecution(1, async () => {
      this.debug(`Getting address of ${tokenAddress}, from ${exchange} on the ${chain} chain`);
      const ret = await Moralis.Web3API.token.getTokenPrice({
        address: tokenAddress,
        chain: chain,
        exchange: exchange,
      }).catch((reason) => {
        this._handleMessage(reason);
      });
      if (ret != null) {
        this.debug(`Received token price data: ${JSON.stringify(ret, null, 2)}`);
      }
      return ret;
    });
  }

  /**
   * Gets the token pair address from 2 tokens.
   *
   * @param {String} token1
   *    The first token in the token pair
   * @param {String} token2
   *    The second token in the token pair
   * @param {String} exchange
   *    Teh exchange to contact for information about the pair
   * @param {String?} chain
   *    The blockchain containing the required information
   *
   * @requestWeight `1` Request.
   * @return {Dict} The response data.
   * @memberof MoralisInterface
   */
  async _getPairAddress(token1, token2, exchange = this.exchange, chain = this.chain) {
    return await this.rateLimitedExecution(1, async () => {
      this.debug(`Getting token pair address of tokens (1|2) on the ${exchange} exchange and the ${chain} chain: (${token1}|${token2})`);
      const ret = await Moralis.Web3API.defi.getPairAddress({
        token0_address: token1,
        token1_address: token2,
        exchange: exchange,
        chain: chain,
      }).catch((reason) => {
        this._handleMessage(reason);
      });
      if (ret != null) {
        this.debug(`Received token pair address and data: ${JSON.stringify(ret, null, 2)}`);
      }
      return ret;
    });
  }

  /**
   * Gets the reserves of both tokens in a pair.
   *
   * @param {String} pairAddress
   *    The token pair address to get the reserves of.
   * @param {String?} chain
   *    The blockchain containing the required information
   *
   * @requestWeight `1` Request
   * @return {Dict} The response data
   * @memberof MoralisInterface
   */
  async _getPairReserves(pairAddress, chain = this.chain) {
    return await this.rateLimitedExecution(1, async () => {
      this.debug(`Getting pair reserves of ${pairAddress} from the ${chain} chain`);
      const ret = await Moralis.Web3API.defi.getPairReserves({
        address: pairAddress,
        chain: chain,
      }).catch((reason) => {
        this._handleMessage(reason);
      });
      if (ret != null) {
        this.debug(`Received pair reserves: ${JSON.stringify(ret, null, 2)}`);
      }
      return ret;
    });
  }

  /**
   * Handles and logs errors in responses from the Moralis module.
   *
   * @param {Dict} reason
   *    The response to log the error for
   *
   * @memberof MoralisInterface
   */
  _handleMessage(reason) {
    if (reason != undefined && reason.error != undefined) {
      this.error(`Hit moralis response error: "${reason.error}"`);
    }
  }
}
module.exports = MoralisInterface;
