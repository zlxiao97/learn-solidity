// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Car {
    string public brand;

    constructor(string memory initialBrand) {
        brand = initialBrand;
    }

    function setBrand(string memory newBrand) public {
        brand = newBrand;
    }
}
