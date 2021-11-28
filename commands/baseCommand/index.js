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
const EventEmitter = require('events');
// eslint-disable-next-line no-unused-vars
const Psycrypt = require('../../src/Psycrypt');

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
    this.events = new EventEmitter();
  }

  /**
   * Emits 'shutdown' event.
   *
   * @memberof BaseCommand
   */
  shutdown() {
    this.events.emit('shutdown');
  }
}

module.exports = BaseCommand;
