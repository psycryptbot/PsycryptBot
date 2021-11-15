//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2020. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//


// eslint-disable-next-line no-unused-vars
const Psycrypt = require('../src/Psycrypt');
const {Select} = require('enquirer');
// TODO: Guided .env setup
// TODO: Network .env setup

/**
 * @param {Psycrypt} psycrypt
 * @return {Promise} Resolves when setup is done
 */
module.exports = async (psycrypt) => {
  const logger = psycrypt.createSubProcess('Setup');
  const firstQuestion = new Select({
    name: 'setupType',
    message: 'Which setup option will you use?',
    choices: ['Guided', 'Network'],
  });

  const result = await firstQuestion.run();
  logger.debug(`${result}`);
  if (result == 'Network') {
    // eslint-disable-next-line max-len
    logger.error(`Sorry, but network is not supported yet ( Sorry to psyc' you out XD )`);
  } else {
    logger.error(`Please implement me!`);
  }
};
