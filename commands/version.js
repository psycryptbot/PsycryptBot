//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

/* eslint-disable no-multi-spaces */

const BaseCommand = require('./BaseCommand');

/**
 * Prints the current version of the bot.
 * Version is set in process.psycrypt.config.version
 *
 * @class VersionCommand
 * @extends {BaseCommand}
 */
class VersionCommand extends BaseCommand {
  /**
   * Creates an instance of VersionCommand.
   *
   * @param {*} location
   * @memberof VersionCommand
   */
  constructor(location) {
    super(
        'Version', // Name
        '0.1.0',   // Command Version
        false,     // Requires Network
        false,     // Requires Exchange API
        location,  // Require Location
    );
    this.endConstruction();
  }

  /**
    @inheritdoc
   */
  execute() {
    this.log(`Version ${process.psycrypt.config.version}`);
  }
}

module.exports = VersionCommand;
