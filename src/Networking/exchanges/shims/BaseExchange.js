//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const {MoralisInterface} = require('./Moralis');

/**
 * The base cryptocurrency exchange ABI describer of which
 * all exchange classes will follow.
 *
 * @class BaseExchange
 * @extends {MoralisInterface}
 */
class BaseExchange extends MoralisInterface {
  /**
   * Creates an instance of BaseExchange.
   *
   * @param {String} name
   * @memberof BaseExchange
   */
  constructor(name) {
    super(name);
  }

  /**
   * Retrievs token list from storage or requests it if outdated
   *
   * @return {Dict|null}
   *    The response.
   *
   * @memberof BaseExchange
   */
  getTokenList() {
    this.warnNotImplemented('getTokenList');
    return null;
  }

  /**
   * Gets a price of a token in USD
   *
   * @param {*} _token
   *    The symbol or address of a token
   *
   * @return {Dict|null}
   *    The response.
   *
   * @memberof BaseExchange
   */
  getTokenPrice(_token) {
    this.warnNotImplemented('getTokenPrice');
    return null;
  }

  /**
   * Gets a token pair's metadata if it exists. It can check
   * a list or it can query it from the exchange. The latter is only
   * used when the list hasn't been updated for too long.
   *
   * @param {String} _token1
   *    The symbol or address of the first token
   * @param {String} _token2
   *    The symbol or address of the second token
   *
   * @return {Dict|null}
   * @memberof BaseExchange
   */
  getTokenPairMetadata(_token1, _token2) {
    this.warnNotImplemented('getTokenPairMetadata');
    return null;
  }

  /* eslint-disable max-len */
  /**
   * Get's the reserve amount of a token pair.
   * Formatted like this:
   *
   * ```js
   * {
   *   reserve1: "1177323085102288091856004", // Amount of token1 in it's own currency
   *   reserve2: "9424175928981149993184". // Amount of token2 in it's own currency
   * }
   * ```
   *
   * @param {String} _pairAddress
   *    The address of the token pair
   *
   * @return {Dict|null}
   * @memberof BaseExchange
   */
  getTokenPairReserves(_pairAddress) {
    this.warnNotImplemented('getTokenPairReserves');
    return null;
  }
  /* eslint-enable max-len */

  /**
   * Calculates the ratio in a token pair reserve to find where a difference is.
   * If the ratio is not 1:1, we have potential profit.
   *
   * @param {String} _token1
   *    The symbol or address of the first token in the reserve
   * @param {String} _token2
   *    The symbol or address of the second token in the reserve
   * @param {String} _reserves
   *    The reserve data to calculate the ratio of.
   *    Obtained through `getTokenPairReserves` of token1/token2
   *
   * @return {Dict<String, Number>|null}
   * @memberof BaseExchange
   */
  calculateRatio(_token1, _token2, _reserves) {
    this.warnNotImplemented('calculateRatio');
    return null;
  }

  /**
   * Checks whether the input is a token address, and returns it back if it is.
   * If not, then it requests it or queries a local list for the address.
   *
   * @param {String} _token
   *   The symbol or address of the token
   *
   * @return {String|null}
   *    The address of the token.
   *
   * @memberof BaseExchange
   */
  determineAddress(_token) {
    this.warnNotImplemented('determineAddress');
    return null;
  }

  /**
   * Logs a warning when function that was not implemented
   * in the parent class is called
   *
   * @param {String} functionName
   *    The name of the function that was called when not implemented
   * @memberof BaseExchange
   */
  _warnNotImplemented(functionName) {
    this.warn(`"${functionName}" not implemented in ${this.constructor.name}`);
  }
}

module.exports = BaseExchange;
