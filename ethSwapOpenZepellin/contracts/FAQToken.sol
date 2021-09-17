// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FAQToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("FAQToken", "FAQ") {
        _mint(msg.sender, initialSupply);
    }
}
