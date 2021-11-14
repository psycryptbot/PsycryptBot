
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
   * @param {Psycrypt} parent
   *    The parent that will be calling the command
   *    which in this case is the Psycrypt object.
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
      parent,
      location,
  ) {
    super(name);
    this.description = description;
    this.version = version;
    this.requiresNetwork = requiresNetwork;
    this.requiresAPI = requiresAPI;
    this.parent = parent;
    this.location = location;
    this.events = new EventEmitter();
  }
}

module.exports = BaseCommand;
