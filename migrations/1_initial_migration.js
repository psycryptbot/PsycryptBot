//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//
//

const Migrations = artifacts.require('Migrations');

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
