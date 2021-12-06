//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const MoralisInterface = require('./Moralis');
const path = require('path');
const fs = require('fs');

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
    this.tokenListUrl = '';
    this.tokenListName = '';
    this.tokenListPath = '';
    this.staticTokenList = false;
    this.tokenList = null;
  }

  /**
   * Retrievs token list from storage or requests it if outdated
   *
   * @return {Promise<Dict|null>}
   *    The response.
   *
   * @memberof BaseExchange
   */
  async getTokenList() {
    await this._updateTokenListIfNeeded();
    return this.tokenList;
  }

  /**
   * Gets a price of a token in USD
   *
   * @param {String} token
   *    The symbol or address of a token
   *
   * @return {Promise<Dict|null>}
   *    The response.
   *
   * @memberof BaseExchange
   */
  async getTokenPrice(token) {
    token = this.determineAddress(token);
    return this._useMoralisContextIfAvailable(async () => {
      return this._getTokenPrice(token);
    }, null);
  }

  /**
   * Gets a token pair's metadata if it exists. It can check
   * a list or it can query it from the exchange. The latter is only
   * used when the list hasn't been updated for too long.
   *
   * @param {String} token1
   *    The symbol or address of the first token
   * @param {String} token2
   *    The symbol or address of the second token
   *
   * @return {Promise<Dict|null>}
   * @memberof BaseExchange
   */
  async getTokenPairMetadata(token1, token2) {
    token1 = this.determineAddress(token1);
    token2 = this.determineAddress(token2);
    return this._useMoralisContextIfAvailable(async () => {
      return this._getTokenPairMetadata([token1, token2]);
    }, null);
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
   * @param {String} pairAddress
   *    The address of the token pair
   *
   * @return {Promise<Dict|null>}
   * @memberof BaseExchange
   */
  async getTokenPairReserves(pairAddress) {
    return this._useMoralisContextIfAvailable(async () => {
      return this._getPairReserves(pairAddress);
    });
  }
  /* eslint-enable max-len */

  /**
   * Calculates the ratio in a token pair reserve to find where a difference is.
   * If the ratio is not 1:1, we have potential profit.
   *
   * @param {String} token1
   *    The symbol or address of the first token in the reserve
   * @param {String} token2
   *    The symbol or address of the second token in the reserve
   * @param {String} reserves
   *    The reserve data to calculate the ratio of.
   *    Obtained through `getTokenPairReserves` of token1/token2
   *
   * @return {Promise<Dict<String, Number>|null>}
   * @memberof BaseExchange
   */
  async calculateRatio(token1, token2, reserves) {
    token1 = this.determineAddress(token1);
    token2 = this.determineAddress(token2);
    const token1Amount = this.getTokenPrice(token1) * reserves.reserve1;
    const token2Amount = this.getTokenPrice(token2) * reserves.reserve2;
    return `${token1Amount}:${token2Amount}`;
  }

  /**
   * Checks whether the input is a token address, and returns it back if it is.
   * If not, then it requests it or queries a local list for the address.
   *
   * @param {String} token
   *   The symbol or address of the token
   *
   * @return {String|null}
   *    The address of the token.
   *
   * @memberof BaseExchange
   */
  determineAddress(token) {
    let ret = null;
    Object.values(this.tokenList.tokens).forEach((tokenVal) => {
      if (tokenVal.symbol == token) {
        ret = tokenVal.address;
      } else if (token == tokenVal.address) {
        ret = token;
      }
    });
    if (ret == null) {
      // eslint-disable-next-line max-len
      this.error(`Invalid token address or token symbol ${require('util').inspect(token, false, -1, true)}`);
    }
    return ret;
  }

  /**
   * Logs a warning when function that was not implemented
   * in the parent class is called
   *
   * @param {String} functionName
   *    The name of the function that was called when not implemented
   * @memberof BaseExchange
   */
  async _warnNotImplemented(functionName) {
    this.warn(`"${functionName}" not implemented in ${this.constructor.name}`);
  }

  /**
   * Acts as a logic gate between two control flows depending
   * on whether the config supports moralis
   *
   * @param {Function} moralisExecutor
   *    The code that utilizes moralis
   * @param {Function} otherExecutor
   *    The code that uses other means
   *
   * @return {Promise<any>} The return value of the executed code
   * @memberof BaseExchange
   */
  async _useMoralisContextIfAvailable(moralisExecutor, otherExecutor) {
    // TODO: Intentionally broken, fix later
    if (process.psycrypt.config.useMoralis || true) {
      return await moralisExecutor();
    } else {
      return await otherExecutor();
    }
  }

  /**
   * Ensures the existance of the token list curated by an exchange.
   * Location on disk is `../TokenLists/` + `this.tokenListName`
   * If it's not there writes it to disk. After ensuring, it checks to
   * see if it's up to date. If not, it updates the list.
   *
   * Visit: `https://tokenlists.org` to see how they're structured, and
   * how to get a hold of one.
   *
   * @memberof BaseExchange
   */
  async _updateTokenListIfNeeded() {
    // eslint-disable-next-line max-len
    this.tokenListPath = path.join(__dirname, `../TokenLists/${this.tokenListName}.json`);

    const writeList = async () => {
      const data = (await this.get(this.tokenListUrl)).data;
      data.lastUpdatedTimestamp = Date.now();
      fs.writeFileSync(this.tokenListPath, JSON.stringify(data, null, 2), {
        encoding: 'utf-8',
      });
      this.tokenList = data;
    };

    if (this.staticTokenList == true) {
      if (!this.tokenList) {
        this.tokenList = require(this.tokenListPath);
      }
      return;
    }

    if (fs.existsSync(this.tokenListPath)) {
      const tokenList = require(this.tokenListPath);
      const oneDay = ((1000*60)*60) * 24;
      if ((Date.now() - tokenList.lastUpdatedTimestamp) > oneDay) {
        await writeList();
      } else {
        this.tokenList = require(this.tokenListPath);
      }
    } else {
      await writeList();
    }
  }

  /**
   * Calls `this._updateTokenListIfNeeded` and returns `this.tokenList`
   *
   * @memberof BaseExchange
   */
  async getList() {
    await this._updateTokenListIfNeeded();
    return this.tokenList;
  }
}

module.exports = BaseExchange;
