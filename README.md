<!-- markdownlint-disable MD001 MD023 MD026 -->
# PsycriptBot To-Do

## ❯ Arbitrage

We will be using [0x](https://0x.org/) as this will allow us to work with all the good DEX networks.

Examples being:

- Uniswap
- Curve
- Moonwap
- etc...

This also allows us to work networks other than the main-net such as Polygon.

This means that we are going to be adding 0x integration to our todo list:

- [ ] 0x Integration

Second, we want to be able to call flash loans, so we want to be able to interact with liquidity pools such as the aave provider. For our purposes we'll want to be using AaveV2

- [ ] AaveV2 Integration

## ❯ Commands

We already have the groundwork for our commands, but we want to actually start adding some. These can be used for testing purposes and for custom configurations on a single-use basis. There will be a couple commands that we should make from the get-go for CLI's sake. These are what follows:

- [ ] `version`: Displays the version.
- [ ] `config`: Gives an optional prompt to the user to manage their configuration.
- [ ] `help`: Displays a list of commands to the user.
- [ ] `deamon`: gives information about the deamon status. (same as `systemctl` in some ways)

More to come...

## ❯ Contracts 

Basically all the functionality we need is going to be on the blockchain. This will allow us to cancel tranfers mid execution from within the chain instead of being locked into an exchange if it costs too much. This functionality can be anything from calling a flashloan or executing a tranfer on multiple exchanges.

# TODO (OLD)

<!-- markdownlint-disable-next-line -->
**In no particular order**

- [x] Working Startup
- [ ] Command Implementation
  - [x] Load Command
  - [x] Unload Command
  - [x] Reload Command
  - [ ] Dynamic Command Updating
  - [ ] Add Essential Commands
- [x] Setup Tools
  - [ ] Network Setup
    - [ ] Integrate with private network server
  - [ ] Manual Setup - `Cero 1`
    - [ ] Create .env
- [ ] Setup database
- [ ] Implement Interactive mode - `Cero 2`
- [ ] Implement Read-Execute-Exit (REE) CLI mode (Regular CLI only)
- [ ] Implement Unified API Entity (UAE) for easy exchange interaction no matter the type
- [ ] Create email service (Or use temp email services)
- [ ] Add KYC-less echanges (preferably NPN, NF ones from [here](https://bitshills.com/best-non-kyc-crypto-exchanges/))

  ##### For each exchange do this:

  - [ ] Create Account Generator
  - [ ] Implement all API's within UAE
  - [ ] Update config to query database for account details

  ##### List Completed ones here:

  - None

- [ ] Start repeated scanning from multiple accounts for changes in the market
- [ ] Implement rotating proxy within local networks
- [ ] Work on actual arbitrage `// TODO: Write the todo for this lol`
- [ ] Implement Network Master mode
- [ ] Implement Remote Updater

> **NPN, and NF stand for "no phone number" and "no fee" respectively*
