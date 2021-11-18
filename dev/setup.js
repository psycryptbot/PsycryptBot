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
const {Select, Form} = require('enquirer');
const fs = require('fs');
const path = require('path');
const rootPath = path.join(__dirname, '../');
const configBase = require(path.join(rootPath, 'config-base'));

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
    // Am I being lazy? I'm just going to finish this when I actually know
    // What I am configuring

    // const configQuestion = new Form({
    //   name: 'config',
    //   message: 'Please setup your config.js here:',
    //   choices: Object.keys(configBase).map((key, __unused) => {
    //     const value = configBase[key];
    //     return {
    //       name: key,
    //       message: value,
    //     };
    //   }),
    // });
    // const result = await configQuestion.run();
    // const merged = Object.assign(configBase)
    // fs.writeFileSync();
  }
};
