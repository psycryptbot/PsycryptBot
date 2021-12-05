//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

/**
 * Basically copy-paste, nothing special
 */

const path = require('path');
const fs = require('fs');
const sourcePath = path.join(
    __dirname,
    '../src/Networking/exchanges/TokenLists/sushiswap_token_list.json',
);
// eslint-disable-next-line max-len
const buildList = require('@sushiswap/default-token-list/build/sushiswap-default.tokenlist.json');

fs.writeFileSync(sourcePath, JSON.stringify(buildList, null, 2), {
  encoding: 'utf-8',
});
