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
const Logger = require('./Logger');
const path = require('path');
const rootPath = path.join(__dirname, '../');
const Arbitrage = require('./Arbitrage');
const readlineSync = require('readline-sync');
const {cyanBright} = require('chalk');
const BaseCommand = require('../commands/baseCommand');

/**
 * Main state of the entire bot
 *
 * @class Psycrypt
 */
class Psycrypt extends Logger {
  /**
   * Creates an instance of Psycrypt.
   *
   * @memberof Psycrypt
   */
  constructor() {
    super('Psycrypt');
    process.psycrypt = this;
    this.overwrites = {};
    this.config = {
      version,
    };
    this.registeredMoralisInstance = false;
    this.commands = {};
    this.arguments = minimalist(process.argv.slice(2));
    this.arbitrage = new Arbitrage();
    this.adoptSubProcesses([this.arbitrage]);
    this.ensureConfig();
    this.endConstruction();
    this.runLoop();
  }

  /**
   * Distrubutes execution among the entire bot
   *
   * There are two different control flows. The first one
   * is if there are command arguments:
   *
   * ```js
   * if (this.arguments.commandName == true) // Any command name
   * ```
   *
   * The second one is where there is no commands but a runlook was specified
   * through `--runLoop`. Passing both `--runLoop` and a command will execute
   * the command and then enter into the runloop.
   * @memberof Psycrypt
   */
  async runLoop() {
    /*
      With the loops, you can enter a command loop, exit it
      and then enter into runLoop if that's also flagged
    */
    const keys = Object.keys(this.arguments);
    const commandLoop = keys.find((value) => /commandLoop/gi.test(value));
    const runLoop = keys.find((value) => /runLoop/gi.test(value));
    if (commandLoop || runLoop) { // Save a JMP instruction
      if (commandLoop) {
        // Only setup commands when we need them
        this.setupCommands();
        while (true) {
          const commandName = readlineSync.question(cyanBright('> '));
          if (this.parseCommand(commandName)) {
            break;
          }
        }
      }
      if (runLoop) {
        while (true) {
          await this.arbitrage.executeArbitrageCycle();
          break; // Stubbing this for now
        }
      }
    } else {
      // TODO: Support loading one command at a time
      this.setupCommands(); // Innefficient for one command?

      /*
        Since this.arguments._[0] is the only one that matters
        for the commandName, we can slice the name from the array
        and allow the command we run to have full access
        to `this.arguments` (or `process.psycrypt.arguments`)
      */
      const commandName = this.arguments._.shift();
      if (commandName) {
        this.parseCommand(commandName);
      }
    }

    // Shutdown code can be written here
  }

  /**
   * Parses a command name, handles the execution, and catches invalid input
   *
   * @param {String} commandName
   * @return {Boolean|undefined}
   * @memberof Psycrypt
   */
  parseCommand(commandName) {
    const commandLC = commandName.toLowerCase();
    if (commandLC == 'done' || commandLC == 'exit') {
      return true;
    }
    const command = this.getCommand(commandLC);
    if (command == null) {
      process.stdout.cursorTo(0);
      this.error(`Unknown command: ${commandName}`);
    } else {
      BaseCommand.executeCommand(command);
    }
  }

  // TODO: Implement aliases for shorthand
  /**
   * Gets a command from its name or alias
   *
   * @param {String} commandName
   * @return {BaseCommand}
   * @memberof Psycrypt
   */
  getCommand(commandName) {
    let ret = null;
    Object.values(this.commands).forEach((command, _) => {
      if (command._name.toLowerCase() == commandName) {
        ret = command;
      }
    });
    return ret;
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
      if (command == 'BaseCommand') {
        continue;
      }
      this.loadCommand(commandPath, command);
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
    const location = path.join(commandPath, commandName);
    const commandObj = new (require(location))(location);
    commandObj.becomeSubProcess(this);
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
