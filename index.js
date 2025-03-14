//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//
require('dotenv').config();
const path = require('path');
const semver = require('semver');
const {exit} = process; // This is funny ;p

if (semver.gt('14.15.0', process.versions.node)) {
  console.error('[ERROR] node version lower than 14.15.0');
  exit(1);
}
new (require(path.join(__dirname, 'src/Psycrypt')))();
