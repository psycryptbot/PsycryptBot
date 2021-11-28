//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const minimalist = require('minimist');
const {version} = require('../package.json');
const fs = require('fs');
// const klaw = require('klaw');
const EventEmitter = require('events');
const Logger = require('./Logger');
const path = require('path');
const rootPath = path.join(__dirname, '../');
const Arbitrage = require('./Arbitrage');
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
    this.arbitrage = new Arbitrage();
    // Check for config existance before anything

    this.adoptSubProcesses([this.arbitrage]);
    this.ensureConfig();
    this.setupCommands();
    this.endContruction();
  }

  /**
   * Makes sure that the config exists and calls a setup if not
   *
   * @memberof Psycrypt
   */
  ensureConfig() {
    const configDir = path.join(rootPath, 'config.js');
    const setupDir = path.join(rootPath, 'dev/setup');
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
      if (command == 'baseCommand') {
        continue;
      }
      this.loadCommand(commandPath, commandName);
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
   * @param {String} commandPath
   * @param {String} commandName
   * @memberof Psycrypt
   */
  loadCommand(commandPath, commandName) {
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
