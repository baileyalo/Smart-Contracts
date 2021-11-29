
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Prime {

    address public owner = msg.sender;

    constructor() public {

    }
   function isPrime(uint256 n) public pure returns (bool) {
       for(uint256 i = 2; i < n; i++){
           
           
       if(n % i == 0)
      
      
        return false;
}
        return true;
}

}