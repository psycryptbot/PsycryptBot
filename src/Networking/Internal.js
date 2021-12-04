//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const Logger = require('../Logger');
const axios = require('axios').default;
const endpoints = require('./endpoints');

/**
 * The WebSocket interface
 *
 * @class WebSocket
 * @extends {Logger}
 */
class WebSocket extends Logger {
  /**
   * Creates an instance of Websocket.
   *
   * @memberof Websocket
   */
  constructor() {
    super('WebSocket');
    this.endpoints = endpoints;

    this.endContruction();
  }
}


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
   * @argument {String} name
   *    Logging name to be passed onto the parent class.
   *
   * @memberof REST
   */
  constructor(name) {
    super(name);
    this.endpoints = endpoints;
    this.rateLimit = -1;
    this.counter = -1;
    this.rateLimitResetInterval = -1;
    this.lastCalledBuffer = -1;
    this.endContruction();
    this.on('WAIT', (startDate) => {
      this.debug(`Waiting ${startDate - Date.now()}ms for rate limits`);
    });
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
      if (this.rateLimit < 1) {
        resolve((await executor()));
      }
      // No counter, ie: first call
      if (this.counter == -1) {
        requestCount += 1;
      } else {
        // If we've non-explicity waited the interval reset counter
        if (
          (Date.now() - this.lastCalledBuffer) > this.rateLimitResetInterval
        ) {
          this.counter = 0;
        }
      }
      // if the request count would hit the ratelimit,
      // we wait on the current request.
      if (this.counter + requestCount >= this.rateLimit) {
        this.emit('WAIT', Date.now() + this.rateLimitResetInterval);
        resolve(null); // Seems sus
      } else {
        this.counter += requestCount;
        resolve(await executor());
      }
    });
  }
}

module.exports = {
  REST: REST,
  WebSocket: WebSocket,
};
