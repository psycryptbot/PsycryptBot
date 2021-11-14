//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

const semver = require('semver');
if (semver.gt('14.15.0', process.versions.node)) {
  console.error('[ERROR] node version lower than 14.15.0');
  exit(1);
}
new (require('../src/Psycrypt'))();
