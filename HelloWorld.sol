// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract MyContract{

  string public name = "sdfa";

  // Write functions cost gas
  function setName (string memory _s ) public {
    name = _s;
  }

  // Read functions are free, reading from the blockchain is free
  function getName() public view returns (string memory){
    return name;
  }

  // view = keyword means that the function does not modify the state of the blockchain

  // pure = functions do not modify the state but also do not read the state

  // payable = functions are allowed to recieve ETH cryptocurrency



  mapping (uint => string) public names;
  mapping (address => bool) public hasVoted;
  mapping (address => mapping(uint => bool)) public myMapping;

  struct Book{
    string title;
    address author;
    bool completed;
  }

  address owner;
  function deposit() payable external  {

  }

  function sendEther(address payable to, uint amount) external {
    (bool sent, bytes memory data) = to.call{value: amount}("");
  }
  
  // call another smart contract

}
