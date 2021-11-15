//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2020. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const chalk = require('chalk');

// TODO: Make logger upload logs
// TODO: Log files/storage
// TODO: Coloring. (possibly with chalk?)

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
   * @memberof Logger
   */
  constructor(name) {
    this.name = name;
    this.children = [];
    this.parent = null;
  }

  /**
   * Normal Logging
   *
   * @param {String} message
   * @memberof Logger
   */
  log(message) {
    console.log(chalk.bold.white(`[${this.name}] ${message}`));
  }

  /**
   * Warning logging
   *
   * @param {String} message
   * @memberof Logger
   */
  warn(message) {
    console.warn(chalk.bold.yellowBright(`[${this.name}] Warning: ${message}`));
  }

  /**
   * Error logging
   *
   * @param {String} message
   * @memberof Logger
   */
  error(message) {
    console.error(chalk.red(`[${this.name}] Error: ${message}`));
  }

  /**
   * Debug logging
   *
   * @param {String} message
   * @memberof Logger
   */
  debug(message) {
    console.log(chalk.yellow(`[${this.name}] Debug: ${message}`));
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
