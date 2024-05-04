// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./Auction.sol";

contract AuctionHouse {
    address public owner;
    uint public numAuctions;
    uint8 public houseFee;
    mapping(uint => address) public auctions;

    event AuctionCreated(uint indexed auctionId, address indexed auctionAddress);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createAuction() external onlyOwner {
        Auction newAuction = new Auction(payable(msg.sender));
        auctions[numAuctions] = address(newAuction);
        emit AuctionCreated(numAuctions, address(newAuction));
        numAuctions++;
    }
}