// SPDX-License-Identifier: UNLICENCED
//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

pragma solidity >=0.4.22 <0.9.0;

import { FlashLoanReceiverBase } from "./aaveV2/FlashLoanReceiverBase.sol";
import { ILendingPool } from "./aaveV2/ILendingPool.sol";
import { ILendingPoolAddressesProvider } from "./aaveV2/IlendingPoolAddressesProvider.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FlashLoan is FlashLoanReceiverBase {

  // This error seems trivial... need to run tests
  constructor(ILendingPoolAddressesProvider provider) FlashLoanReceiverBase(provider) {}

  // Quite a basic flashloan exec function.
  // Looking to improve this later
  function executeOperation(
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    bytes calldata params
  ) external override returns (bool) {
    //TODO write arbitrage code here

    for (uint i = 0; i < assets.length; i++) {
      uint amountOwing = amounts[i] + premiums[i];
      IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
    }
    return true;
  }
}