// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

contract HotelRoom {
    address payable public owner;
    enum StatusesRoom {
        Vacant,
        Occupied
    }
    StatusesRoom currentStatus;
    uint256 private value;

    constructor() {
        owner = payable(msg.sender);
        value = 2 ether;
        currentStatus = StatusesRoom.Vacant;
    }

    receive() external payable isVaccant isEnoughMoney {
        owner.transfer(msg.value);
        currentStatus = StatusesRoom.Occupied;
        emit Ocuppy(msg.sender, msg.value);
    }

    modifier isVaccant() {
        require(currentStatus == StatusesRoom.Vacant, "Currently Occupied");
        _;
    }

    modifier isEnoughMoney() {
        require(msg.value >= value, "Not enough ether for this room");
        _;
    }

    event Ocuppy(address _ocupant, uint256 _value);
}
