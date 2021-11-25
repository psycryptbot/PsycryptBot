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
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IFlashLoanReceiver interface
 * @notice Interface for the Aave fee IFlashLoanReceiver.
 * @author Corban Amouzou
 * @dev implement this interface to develop a flashloan-compatible flashLoanReceiver contract
 **/
contract Withdrawable is Ownable {

  address constant ETHER = address(0);

  event LogWithdraw(
    address indexed _from,
    address indexed _assetAddress,
    uint amount
  );

  function withdraw(address _assetAddress) public onlyOwner {
    uint assetBalance;
    address self = address(this);
    if (_assetAddress == ETHER) {
      assetBalance = self.balance;
    } else {
      assetBalance = IERC20(_assetAddress).balanceOf(self);
      IERC20(_assetAddress).transfer(msg.sender, assetBalance);
    }
    emit LogWithdraw(msg.sender, _assetAddress, assetBalance);
  }

}
