//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

require('@nomiclabs/hardhat-waffle');

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  console.log(Object(accounts).map((val, idx) => val.address));
  console.log(`${accounts.length} Total accounts`);
});


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.0',
  networks: {
    hardhat: {
      forking: {
        url: 'https://eth-mainnet.alchemyapi.io/v2/7tgCjINGBc9dCu5B5k6HN2KHm_LZ2mlU',
        blockNumber: 13756627,
      },
    },
  },
};
