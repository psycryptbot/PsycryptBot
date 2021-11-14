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
const rootPath = path.join(__dirname, '../../');

/**
 * Main state of the entire bot
 *
 * @class Psycrypt
 */
class Psycrypt extends Logger {
  /**
   * Creates an instance of Psycrypt.
   *
   * @param {Array} arguments
   * @memberof Psycrypt
   */
  constructor() {
    super('Psycrypt');
    this.log(`Starting!`);
    this.overwrites = {};
    this.config = {};
    this.commands = {};
    this.version = version;
    this.arguments = minimalist(process.argv.slice(3));
    this.events = new EventEmitter();

    // Check for config existance before anything
    this.ensureConfig();
    this.setupCommands();
  }

  /**
   * Makes sure that the config exists and calls a setup if not
   *
   * @memberof Psycrypt
   */
  ensureConfig() {
    const configDir = path.join(rootPath, 'config.js');
    const setupDir = path.join(rootPath, 'startup/scripts/setup');
    if (fs.existsSync(configDir) && this.config == {}) {
      this.config = require(configDir);
    } else {
      const setup = require(setupDir);
      setup();
    }
  }

  /**
   * Sets up all the commands for the bot.
   * This allows other parts of the bot to have access to them
   * and to trigger than mid-execution
   *
   * @memberof Psycrypt
   */
  setupCommands() {
    const commandPath = path.join(rootPath, 'commands');
    const commands = fs.readdirSync(commandPath);
    for (const command of commands) {
      if (commandName == 'baseCommand') {
        continue;
      }
      this.loadCommand(command);
    }
  }

  /**
   * Reloads a command from the source. This allows for runtime
   * modifications to command sources without having to completely
   * restart the process.
   *
   * @param {String} commandName
   * @memberof Psycrypt
   */
  reloadCommand(commandName) {
    this.unloadCommand(commandName);
    this.loadCommand(commandName);
  }

  /**
   * Loads a command into this.commands
   *
   * @param {String} commandName
   * @memberof Psycrypt
   */
  loadCommand(commandName) {
    if (Object.keys(this.commands).includes(commandName)) {
      this.warn(`Tried to load command ${commandName}, but it already exists`);
      return;
    }
    this.debug(`Loading command ${commandName}`);
    const location = path.join(commandPath, command);
    const commandObj = new (require(location))(this, location);
    this.commands[commandObj.name] = commandObj;
  }

  /**
   * Removes a command from this.commands and require cache,
   * completely unloading it from runtime.
   *
   * @param {String} commandName
   * @memberof Psycrypt
   */
  unloadCommand(commandName) {
    if (!Object.keys(this.commands).includes(commandName)) {
      this.warn(`Tried to unload command ${commandName}, but it doesn't exist`);
      return;
    }
    const command = this.commands[commandName];
    const resolved = require.resolve(`${command.location}/${command.name}`);
    delete require.cache[resolved];
    delete this.commands[commandName];
  }
}

module.exports = Psycrypt;
