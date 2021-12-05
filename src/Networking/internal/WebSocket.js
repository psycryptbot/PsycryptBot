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
  }
}

module.exports = WebSocket;
