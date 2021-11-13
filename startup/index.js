//
// PsycryptBot
// Copyright (c) 2021. Corban Amouzou, Hunter Ummels.
//
const semver = require('semver');
if (semver.gt('14.15.0', process.versions.node)) {
  console.error('[ERROR] node version lower than 14.15.0');
  exit(1);
}
new (require('../src/public/Psycrypt'))();

