//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const minimalist = require('minimist');
const version = require('../../package.json').version;
const fs = require('fs');
// const klaw = require('klaw');
const EventEmitter = require('events');
const Logger = require('../logger');
const path = require('path');

/**
 * Main state of the entire bot
 * @class Psycrypt
 */
class Psycrypt extends Logger {
  /**
   * Creates an instance of Psycrypt.
   * @param {Array} arguments
   * @memberof Psycrypt
   */
  constructor() {
    super('Psycrypt');
    this.overwrites = {};
    this.config = {};
    this.version = version;
    this.arguments = minimalist(process.argv.slice(3));
    this.events = new EventEmitter();

    // Check for config existance before anything
    this.ensureConfig();
  }

  /**
   * Makes sure that the config exists and calls a setup if not
   * @memberof Psycrypt
   */
  ensureConfig() {
    const configDir = path.join(__dirname, '../../config.js');
    const setupDir = path.join(__dirname, '../../startup/scripts/setup');
    if (fs.existsSync(configDir) && this.config == {}) {
      this.config = require(configDir);
    } else {
      const setup = require(setupDir);
      setup();
    }
  }
}

module.exports = Psycrypt;
