//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const path = require('path');
const rootPath = path.join(__dirname, '../../');
const Logger = require(path.join(rootPath, 'src/logger'));

/**
 * The main command interface that will be managed
 * By the parent class "Psycript".
 *
 * @class BaseCommand
 */
class BaseCommand extends Logger {
  /**
   * Creates an instance of BaseCommand.
   *
   * @param {String} name
   *    Name of the command.
   * @param {String} description
   *    Description of the command.
   * @param {String} version
   *    Version of the command.
   * @param {Boolean} requiresNetwork
   *    Set to true if internet access is
   *    required to run the command.
   * @param {Boolean} requiresAPI
   *    Set to true if Dashboard API access is
   *    required to run the command.
   * @param {String} location
   *    The physical location of copmmand for require cache purposes
   * @memberof BaseCommand
   */
  constructor(
      name,
      description,
      version,
      requiresNetwork,
      requiresAPI,
      location,
  ) {
    super(name);
    this.description = description;
    this.version = version;
    this.requiresNetwork = requiresNetwork;
    this.requiresAPI = requiresAPI;
    this.location = location;

    // Execute event: executeStart
    this.on('executeStart', () => {
      this.debug(`Executing`);
      this._executeStamp = Date.now();
    });
    // Execute end event: executeEnd
    this.on('executeEnd', () => {
      this.debug(`Finished executing +${Date.now() - this._executeStamp}ms`);
    });
  }

  /**
   * Emits 'shutdown' event.
   *
   * @memberof BaseCommand
   */
  shutdown() {
    this.emit('shutdown');
  }

  /**
   * The body of the command; The entry point so-to-speak.
   *
   * We don't have to worry about arguments here because they
   * are located in the process variable
   *
   * ```js
   * const commandArgs = process.psycrypt.arguments;
   * ```
   *
   * @memberof BaseCommand
   */
  execute() {
    this.warn(`Nothing to execute?`);
  }

  /**
   * Executes a command and fires associated events
   *
   * @param {BaseCommand} command
   * @static
   * @memberof BaseCommand
   */
  static executeCommand(command) {
    if (command != null) {
      command.emit('executeStart');
      command.execute();
      command.emit('executeEnd');
    } else {
      console.error('Command not found');
    }
  }
}

module.exports = BaseCommand;
