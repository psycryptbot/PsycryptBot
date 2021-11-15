//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2020. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const path = require('path');
const semver = require('semver');
if (semver.gt('14.15.0', process.versions.node)) {
  console.error('[ERROR] node version lower than 14.15.0');
  exit(1);
}
new (require(path.join(__dirname, 'src/Psycrypt')))();
