//
// PsycryptBot
// Copyright (c) 2021. Corban Amouzou, Hunter Ummels.
//

// TODO: Make logger adopt coloring and stack tracing
// TODO: Adopt log storing

/**
 * Main logger class for entire bot.
 * Classes can extend from this
 *
 * @class Logger
 */
class Logger {
  /**
   * Creates an instance of Logger
   * @param {String} name
   * @memberof Logger
   */
  constructor(name) {
    this.name = name;
  }
  /**
   * Normal Logging
   * @param {String} message
   * @memberof Logger
   */
  log(message) {
    console.log(`[${this.name}] ${message}`);
  }
  /**
   * Warning logging
   * @param {String} message
   * @memberof Logger
   */
  warn(message) {
    console.warn(`[${this.name}] Warning: ${message}`);
  }
  /**
   * Error logging
   * @param {String} message
   * @memberof Logger
   */
  error(message) {
    console.error(`[${this.name}] Error: ${message}`);
  }

  /**
   * Debug logging
   * @param {String} message
   * @memberof Logger
   */
  debug(message) {
    console.log(`[${this.name}] Debug: ${this.message}`);
  }

  /**
   * Creates a logger that operates as a subprocess of the current instance
   * @param {String} subName
   * @memberof Logger
   * @return {Logger}
   */
  createSubProcess(subName) {
    return new Logger(this.name + ' ' + subName);
  }
}

module.exports = Logger;
