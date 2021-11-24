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


import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IFlashLoanReceiver } from "./IFlashLoanReceiver.sol";
import { ILendingPoolAddressesProvider } from "./ILendingPoolAddressesProvider.sol";
import { Withdrawable } from "../Utilities/Withdrawable.sol";
import { ILendingPool } from "./ILendingPool.sol";

abstract contract FlashLoanReceiverBase is IFlashLoanReceiver, Withdrawable {

  ILendingPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
  ILendingPool public immutable LENDING_POOL;

  constructor(ILendingPoolAddressesProvider provider) {
    ADDRESSES_PROVIDER = provider;
    LENDING_POOL = ILendingPool(provider.getLendingPool());
  }

}