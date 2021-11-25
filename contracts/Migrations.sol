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


import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Migrations is Ownable {

  uint256 public last_completed_migration;

  function setCompleted(uint256 completed) public onlyOwner {
      last_completed_migration = completed;
  }

}
