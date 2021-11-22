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

contract Migrations {
    address public owner = msg.sender;
    uint256 public last_completed_migration;

    modifier ownerOnly() {
        require(
          msg.sender == owner, 
          "Message sender needs to be the owner of the contract"
        );
        _;
    }

    function setCompleted(uint256 completed) public ownerOnly {
        last_completed_migration = completed;
    }
}
