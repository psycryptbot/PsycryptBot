//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const Logger = require('../../Logger');
const axios = require('axios');

/**
 * The REST interface
 *
 * @class REST
 * @extends {Logger}
 */
class REST extends Logger {
  /**
   * Creates an instance of REST.
   *
   * @param {String} name
   *    Logging name to be passed onto the parent class.
   * @param {String} rateLimitKey
   *    The key ueed to access global ratelimiting buffers.
   *
   * @memberof REST
   */
  constructor(name, rateLimitKey) {
    super(name);
    this.rateLimitKey = rateLimitKey;
  }

  /**
   * Gets the global rateLimitBuffer based on our buffer key
   *
   * @readonly
   * @memberof REST
   */
  get _() {
    if (process.psycrypt.rateLimitBuffer == undefined) {
      process.psycrypt.rateLimitBuffer = {};
    }
    if (process.psycrypt.rateLimitBuffer[this.rateLimitKey] == undefined) {
      process.psycrypt.rateLimitBuffer[this.rateLimitKey] = {
        rateLimit: -1,
        counter: -1,
        rateLimitResetInterval: -1,
        lastCalledBuffer: -1,
      };
    }
    return process.psycrypt.rateLimitBuffer[this.rateLimitKey];
  }
  /**
   * Sends a request through axios.request
   * logs the response and arguments
   *
   * @argument {Dict} args
   *    Arguments to be passed to axios.request.
   *
   * @return {Dict}
   * @memberof REST
   */
  async request(args) {
    const readableArgs = JSON.stringify(args, null, 2);
    this.debug(`Calling axios.request with arguments: ${readableArgs}`);
    return await axios(args);
  }

  /**
   * Sends a get request to the URL passed in.
   *
   * @param {String} url
   *    The URL to send the GET request to.
   *
   * @memberof REST
   */
  async get(url) {
    this.debug(`Sending GET request to "${url}"`);
    return await this.request({
      method: 'GET',
      url,
    });
  }

  /* eslint-disable max-len */
  /**
   * Limits code execution to a ratelimit
   * and emits a 'WAIT' event with an attached start time
   * to begin executing the requests again
   *
   * @param {Number} requestCount
   * @param {Function} executor
   * @return {Promise<*>} A Promise wrapping the return value of `executor`
   * @memberof REST
   */
  rateLimitedExecution(requestCount, executor) {
    return new Promise(async (resolve, _) => {
      // No rate limit
      if (this._.rateLimit < 1) {
        resolve((await executor()));
      }
      // No counter, ie: first call
      if (this._.counter == -1) {
        requestCount += 1;
      } else {
        // If we've non-explicity waited the interval reset counter
        if ((Date.now() - this._.lastCalledBuffer) > this._.rateLimitResetInterval) {
          this._.counter = 0;
        }
      }
      // if the request count would hit the ratelimit,
      // we wait on the current request.
      if (this._.counter + requestCount >= this._.rateLimit) {
        const futureTime = Date.now() + (this._.rateLimitResetInterval - this.lastCalledBuffer);
        this.debug(`Waiting ${((futureTime*1.0)*60)} seconds for rate limits`);
        setTimeout(async () => {
          this.debug(`Resuming requests`);
          resolve(await executor());
        }, this._.rateLimitResetInterval);
        resolve(null); // Seems sus
      } else {
        this._.counter += requestCount;
        this._.lastCalledBuffer = Date.now();
        this.debug(`Set global counter to: ${this._.counter}`);
        resolve(await executor());
      }
    });
  }
  /* eslint-enable max-len */
}

module.exports = REST;
