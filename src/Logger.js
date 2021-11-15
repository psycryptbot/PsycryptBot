//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2020. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

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
    console.log(`[${this.name}] ${message}`);
  }

  /**
   * Warning logging
   *
   * @param {String} message
   * @memberof Logger
   */
  warn(message) {
    console.warn(`[${this.name}] Warning: ${message}`);
  }

  /**
   * Error logging
   *
   * @param {String} message
   * @memberof Logger
   */
  error(message) {
    console.error(`[${this.name}] Error: ${message}`);
  }

  /**
   * Debug logging
   *
   * @param {String} message
   * @memberof Logger
   */
  debug(message) {
    console.log(`[${this.name}] Debug: ${message}`);
  }

  /**
   * Creates a logger that operates as a subprocess of the current instance
   *
   * @param {String} subName
   * @memberof Logger
   * @return {Logger}
   */
  createSubProcess(subName) {
    return new Logger(this.name + ' ' + subName);
  }

  /**
   * Takes the current logger and associates it with a parent
   *
   * @param {Logger} parent
   *    The parent to become a child of.
   * @memberof Logger
   */
  becomeSubProcess(parent) {
    if (this.parent == null) {
      this.parent = parent;
      this.name = `${subname} > ${this.name}`;
    } else {
      this.error(`Tried to associate with a parent while already having one`);
    }
  }

  /**
   * Changes the current parent to the provided one
   *
   * @param {Logger} parent
   * @memberof Logger
   */
  attachToNewParent(parent) {
    this.parent = parent;
    const splitName = this.name.split(' ');
    splitName[splitName.length == 2 ? 0 : splitName.length - 3] = parent.name;
    this.name = splitName.join(' ');
  }
}

module.exports = Logger;
