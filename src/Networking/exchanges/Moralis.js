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
// TODO: Document the parameters
// TODO: Handle edge cases and errors
// TODO: Implement rate limit and persistent request checking

const Logger = require('../../Logger');
const Moralis = require('moralis/node');


/**
 * The interface for the Moralis sandboxing the features that we use
 * from unneeded garbage. We use their Web3 api for monitoring purposes
 * NOTE: One time construction ONLY! Moralis is weird and self-implements
 * states and connections. We basically have to wrap their functions
 * with our logger.
 *
 * @class MoralisInterface
 * @extends {Logger}
 */
class MoralisInterface extends Logger {
  /**
   * Creates an instance of MoralisInterface.
   * @memberof MoralisInterface
   */
  constructor() {
    super('Moralis (Web3)');
    this.chain = MORALIS_CHAINS.ethereum;
    Moralis.start({
      serverUrl: process.env.MORALIS_SERVER_URL,
      appId: process.env.MORALIS_API_KEY,
    });
  }

  /**
   * Gets the token metadata given one or more addresses
   *
   * @param {String|Array<String>} addresses
   * @return {Array<Dict>}
   * @memberof MoralisInterface
   */
  async getTokenMetadata(addresses) {
    this.debug(`Getting token metadata from address(es): ${addresses}`);
    const ret = await Moralis.Web3API.token.getTokenMetadata({
      chain: this.chain,
      addresses: addresses,
    });
    this.debug(`Received metadata: ${JSON.stringify(ret, null, 2)}`);
    return ret;
  }
  /**
   * Gets the token metadata given one or more token symbols
   *
   * @param {String|Array<String>} symbols
   * @return {Array<Dict>}
   * @memberof MoralisInterface
   */
  async getMetadataBySymbol(symbols) {
    this.debug(`Getting token metadata from symbols(s): ${symbols}`);
    const ret = await Moralis.Web3API.token.getTokenMetadata({
      chain: this.chain,
      addresses: symbols,
    });
    this.debug(`Received metadata: ${JSON.stringify(ret, null, 2)}`);
    return ret;
  }

  /**
   * Gets a token allowance (not much else to say)
   *
   * @param {String} ownerAddress
   * @param {String} spenderAddress
   * @param {String} tokenAddress
   * @return {Dict}
   * @memberof MoralisInterface
   */
  async getTokenAllowance(ownerAddress, spenderAddress, tokenAddress) {
    this.debug(`Getting allowance of ${ownerAddress} from ${spenderAddress} in token: ${tokenAddress}`);
    const ret = await Moralis.Web3API.token.getTokenAllowance({
      owner_address: ownerAddress,
      spender_address: spenderAddress,
      address: tokenAddress,
    });
    this.debug(`Received allowance: ${JSON.stringify(ret, null, 2)}`);
    return ret;
  }

  /**
   * Gets a token price given an address, exchange, and chain
   *
   * @param {String} tokenAddress
   * @param {String} exchange
   * @param {String} chain
   * @return {Dict}
   * @memberof MoralisInterface
   */
  async getTokenPrice(tokenAddress, exchange, chain) {
    this.debug(`Getting address of ${tokenAddress}, from ${exchange} on the ${chain} chain`);
    const ret = await Moralis.Web3API.token.getTokenPrice({
      address: tokenAddress,
      chain: chain,
      exchange: exchange,
    });
    this.debug(`Received token price data: ${JSON.stringify(ret, null, 2)}`);
    return ret;
  }

  /**
   * Gets the token pair address from 2 tokens
   *
   * @param {String} token1
   * @param {String} token2
   * @param {String} exchange
   * @param {String} chain
   * @memberof MoralisInterface
   */
  async getPairAddress(token1, token2, exchange, chain) {
    this.debug(`Getting token pair address of tokens (1|2) on the ${exchange} exchange and the ${chain} chain: (${token1}|${token2})`);
    const ret = await Moralis.Web3API.defi.getPairAddress({
      token0_address: token1,
      token1_address: token2,
      exchange: exchange,
      chain: chain,
    });
    this.debug(`Received token pair address and data: ${JSON.stringify(ret, null, 2)}`);
    return ret;
  }

  /**
   * Gets the reserves of both tokens in a pair
   *
   * @param {String} pairAddress
   * @param {String} chain
   * @memberof MoralisInterface
   */
  async getPairReserves(pairAddress, chain) {
    this.debug(`Getting pair reserves of ${pairAddress} from the ${chain} chain`);
    const ret = await Moralis.Web3API.defi.getPairReserves({
      address: pairAddress,
      chain: chain,
    });
    this.debug(`Received pair reserves: ${JSON.stringify(ret, null, 2)}`);
    return ret;
  }
}

const MORALIS_CHAINS = {
  ethereum: 'eth',
};

module.exports = MoralisInterface;
