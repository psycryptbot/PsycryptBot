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

    this.endContruction();
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
}

module.exports = {
  REST: REST,
  WebSocket: WebSocket,
};
