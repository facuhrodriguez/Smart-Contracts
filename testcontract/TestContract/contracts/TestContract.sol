// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

contract TestContract {
    uint256 stateVariable;
    int public count;
    uint[] public numbers;

    constructor() {
        count = 0;
    }

    function double(uint x) public pure checkOdd(x) returns (uint) {
        return x * 2;
    }

    modifier checkOdd(uint x) {
        require( x % 2 == 0);
        _;
    }

    function sum(int x) public returns (int){
        count = count + x;
         return count;
    }

    function sub(int x) public returns (int) {
        count = count - x;
        return count;
    }

    function addNumber(uint x) public checkExist(x) {
        numbers.push(x);
    }

    modifier checkExist(uint x) {
        for (uint i=0; i < numbers.length; i++) {
            require(numbers[i] == x);
        }
        _;
    }

}