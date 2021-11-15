//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2020. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

/**
 * Main logger coloring utility
 *
 * @class LoggerColorUtil
 */
class LoggerColorUtil {
  /**
   * Creates an instance of LoggerColorUtil.
   *
   * @memberof LoggerColorUtil
   */
  constructor() {
    this.colors = {
      black: '\x1b[30m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      reset: '\x1b[0m',
    };
  }

  /**
   * Disables the colorization
   *
   * @memberof LoggerColorUtil
   * @return {void}
   */
  disable() {
    this.colors = {};
  }

  /**
   * Checks if the console supports colors
   *
   * @return {boolean}
   */
  supportsColors() {
    return process.stdout.isTTY;
  }

  /**
   * Returns the color code for the given color
   *
   * @param {string} color
   * @return {string}
   * @memberof LoggerColorUtil
   */
  getColor(color) {
    return this.colors[color] || '';
  }

  /**
   * Attempts to color the given string
   * If the string is empty, returns the string
   * If the string is not empty, but the console does not support colors,
   * returns the string
   *
   * @param {string} string
   * @param {string} color
   * @return {string}
   * @memberof LoggerColorUtil
   */
  colorize(string, color) {
    if (!string) {
      return string;
    }

    if (!this.supportsColors()) {
      return string;
    }

    return this.getColor(color) + string + this.getColor('reset');
  }
}

module.exports = LoggerColorUtil;
