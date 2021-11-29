// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GBCToken is ERC20  {
// state variables
    uint256 private _totalSupply;
    uint8 private _decimals;
    uint256 private _startTime;
    uint256 private _endTime;
    
    mapping(address => uint256) public _balances;
    
    constructor (
        string memory _name_, 
        string memory _symbol_,
        uint256 _totalSupply_,
        uint8  _decimals_,
        uint256 _endTime_) 
        ERC20(_name_,_symbol_) {
            _balances[msg.sender]  += _totalSupply_;
            _startTime = block.timestamp;
            _decimals=_decimals_;
            _totalSupply=_totalSupply_;
            _endTime=block.timestamp + _endTime_;
    }

    function transfer( address _recipient, uint256 _amount) public virtual override returns (bool){
        require(msg.sender != address(0),"ERC20: transfer from zero address");
        require(_recipient != address(0),"ERC20: transfer from zero address");
        require(_balances[msg.sender] >= _amount,"ERC20: sender does not have enough balance");
        require((_endTime > block.timestamp) && (block.timestamp > _startTime),"ERC20: Cannot transact outside of the specified time");
        _balances[msg.sender] -= _amount;
        _balances[_recipient] += _amount;
        return true;
    }
    
}


contract Contribution {
    
    mapping(address => uint256) public _tokenbalances;
    mapping(address => uint256) private _ETHContribution;
    
    constructor() { }
    
    function contribute()  external payable{
        _tokenbalances[msg.sender] += msg.value *2;
        _ETHContribution[msg.sender] += msg.value;
    }
    
    function getBalance(address addr) public view returns (uint256){
        return addr.balance;
    }
    
    function ContributedETH(address _addr) public view returns (uint256){
        return  _ETHContribution[_addr];
    }
    
    receive()  external  payable{}

}