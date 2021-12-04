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
// TODO: Support more chains depending on where we want to arbitrage

const {REST} = require('../../internal');
const Moralis = require('moralis/node');


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
    this.chain = MORALIS_CHAINS.ethereum;
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
      });
      this.handleMessage(ret);
      this.debug(`Received metadata: ${JSON.stringify(ret, null, 2)}`);
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
      });
      this.handleMessage(ret);
      this.debug(`Received metadata: ${JSON.stringify(ret, null, 2)}`);
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
      });
      this.handleMessage(ret);
      this.debug(`Received allowance: ${JSON.stringify(ret, null, 2)}`);
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
  async _getTokenPrice(tokenAddress, exchange, chain = this.chain) {
    return await this.rateLimitedExecution(1, async () => {
      this.debug(`Getting address of ${tokenAddress}, from ${exchange} on the ${chain} chain`);
      const ret = await Moralis.Web3API.token.getTokenPrice({
        address: tokenAddress,
        chain: chain,
        exchange: exchange,
      });
      this.handleMessage(ret);
      this.debug(`Received token price data: ${JSON.stringify(ret, null, 2)}`);
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
  async getPairAddress(token1, token2, exchange, chain = this.chain) {
    return await this.rateLimitedExecution(1, async () => {
      this.debug(`Getting token pair address of tokens (1|2) on the ${exchange} exchange and the ${chain} chain: (${token1}|${token2})`);
      const ret = await Moralis.Web3API.defi.getPairAddress({
        token0_address: token1,
        token1_address: token2,
        exchange: exchange,
        chain: chain,
      });
      this.handleMessage(ret);
      this.debug(`Received token pair address and data: ${JSON.stringify(ret, null, 2)}`);
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
      });
      this.handleMessage(ret);
      this.debug(`Received pair reserves: ${JSON.stringify(ret, null, 2)}`);
      return ret;
    });
  }

  /**
   * Handles and logs errors in responses from the Moralis module.
   *
   * @param {Dict} response
   *    The response to check for an error in
   *
   * @memberof MoralisInterface
   */
  _handleMessage(response) {
    if (response.message != undefined) {
      this.error(`Hit response error: ${response.message}`);
    }
  }
}

const MORALIS_CHAINS = {
  ethereum: 'eth',
};

module.exports = MoralisInterface;
