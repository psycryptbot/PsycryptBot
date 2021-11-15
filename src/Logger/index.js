//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

// TODO: Make logger upload logs
// TODO: Log files/storage
// TODO: Coloring. (possibly with chalk?, or with a custom logger?)
// NOTE: Possibly move away from console.warn and console.error

const LoggerColorUtil = require('./color');

/**
 * Main logger class for entire bot.
 * Classes can extend from this
 *
 * @class Logger
 */
class Logger {
  /**
   * Creates an instance of Logger
   *
   * @param {String} name
   * @param {boolean} [useColor=true]
   * @memberof Logger
   */
  constructor(name, useColor = true) {
    this.name = name;
    this.children = [];
    this.parent = null;

    // TODO: find a way to make this easier to use
    this.colorUtil = new LoggerColorUtil();
    if (!useColor) {
      this.colorUtil.disable();
    }
  }

  /**
   * Normal Logging
   *
   * @param {String} message
   * @memberof Logger
   */
  log(message) {
    console.log(`[${this.name}] ${message}`);
  }
  /**
   * Warning logging
   *
   * @param {String} message
   * @memberof Logger
   */
  warn(message) {
    const colorized =
      this.colorUtil.colorize(`[${this.name}] Warning:`, 'yellow');
    console.warn(`${colorized} ${message}`);
  }

  /**
   * Error logging
   *
   * @param {String} message
   * @memberof Logger
   */
  error(message) {
    const colorized =
      this.colorUtil.colorize(`[${this.name}] Error:`, 'red');
    console.error(`${colorized} ${message}`);
  }

  /**
   * Debug logging
   *
   * @param {String} message
   * @memberof Logger
   */
  debug(message) {
    const colorized =
      this.colorUtil.colorize(`[${this.name}] Debug:`, 'cyan');
    console.log(`${colorized} ${message}`);
  }

  /**
   * Creates a logger that operates as a subprocess of the current instance
   *
   * @param {String} subName
   * @memberof Logger
   * @return {Logger}
   */
  createSubProcess(subName) {
    const sub = new Logger(subName);
    sub.attachToNewParent(this);
    return sub;
  }

  /**
   * Takes the current logger and associates it with a parent
   *
   * @param {Logger} parent
   *    The parent to become a child of.
   * @memberof Logger
   */
  becomeSubProcess(parent) {
    this.parent = parent;
    const oldName = this.name.split(' ');
    this.name = `${parent.name} > ${oldName[oldName.length-1]}`;
  }
}

module.exports = Logger;
