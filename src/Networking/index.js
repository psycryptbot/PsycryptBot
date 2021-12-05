//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

module.exports = {
  exchanges: {},
};

const fs = require('fs');
const path = require('path');

const exchanges =
  fs.readdirSync(path.join(__dirname, 'exchanges'), {withFileTypes: true})
      .filter((f) => !f.isDirectory() && path.extname(f.name) === '.js');
for (const exchange of exchanges) {
  const name = path.basename(exchange.name, '.js');
  if (name == 'index') continue;
  module.exports.exchanges[name] = require(`./exchanges/${name}`);
}
