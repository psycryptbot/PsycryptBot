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
const EventEmitter = require('events');
/**
 * Main logger class for entire bot.
 * Classes can extend from this
 *
 * @class Logger
 */
class Logger extends EventEmitter {
  /**
   * Creates an instance of Logger
   *
   * @param {String} name
   * @param {boolean} [useColor=true]
   * @memberof Logger
   */
  constructor(name, useColor = true) {
    super();
    this._bootTime = process.hrtime.bigint();
    this._name = name;
    this.children = [];
    this.parent = null;
    // TODO: find a way to make this easier to use
    this.colorUtil = new LoggerColorUtil();
    if (!useColor) {
      this.colorUtil.disable();
    }
  }

  /**
   * The name associated with the logger
   *
   * @readonly
   * @memberof Logger
   */
  get name() {
    if (this.parent != undefined) {
      return `${this.parent.name} > ${this._name}`;
    }
    return this._name;
  }

  /**
   * Ends the logger construction process (and prints boot time)
   *
   * @memberof Logger
   */
  endContruction() {
    const difference = Number(process.hrtime.bigint() - this._bootTime)*1.0;
    this.debug(`Started up ${this.name} +${difference/1000000}ms`);
  }

  /**
   * Normal logging
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
   * Takes the current logger and associates it with a parent
   *
   * @param {Logger} parent
   *    The parent to become a child of.
   * @memberof Logger
   */
  becomeSubProcess(parent) {
    this.parent = parent;
  }

  /**
   * Takes a group of objects extending logger and
   * makes them sub-processes
   *
   * @param {Array<Logger>} processes
   * @memberof Logger
   */
  adoptSubProcesses(processes) {
    for (const process_ of processes) {
      if (process_ == undefined) {
        this.error(`Please don't pass undefined parameters`);
        continue;
      }
      process_.becomeSubProcess(this);
    }
  }
}
module.exports = Logger;
