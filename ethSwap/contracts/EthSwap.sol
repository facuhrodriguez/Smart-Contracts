// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./Token.sol";

contract EthSwap {
    string public name = "Ethswap Instant Exchange";
    Token public token;
    // Value of 1 token in ETH
    uint256 public rate = 100;

    event TokenPurchased(
        address _account,
        address _token,
        uint256 _amount,
        uint256 _rate
    );

    event TokenSold(
        address _account,
        address _token,
        uint256 _amount,
        uint256 _rate
    );

    constructor(Token _token) {
        token = _token;
    }

    function buyTokens() public payable {
        // Calculate the number of tokens to buy
        uint256 tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);
        // Emit event token purchased
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public payable {
        // Calculate the number of ether to sell
        require(token.balanceOf(msg.sender) >= _amount);
        uint256 _etherAmount = _amount / rate;
        require(address(this).balance >= _etherAmount);
        token.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(_etherAmount);
        emit TokenSold(msg.sender, address(token), _amount, rate);
    }

    // Withdraw all money to sender
    function withdrawMoney() public {
        address payable to = payable(msg.sender);
        // Transfer all money from this account to sender account
        to.transfer(address(this).balance);
    }
}
