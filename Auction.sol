// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;


contract Auction {
    address payable public owner;
    bool public ended;
    uint public highestBid;
    address public highestBidder;

    mapping(address => uint) public bids;

    event BidPlaced(address indexed bidder, uint amount);
    event AuctionEnded(address indexed winner, uint amount);

    constructor(address payable _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function placeBid() external payable {
        require(!ended, "Auction has ended");
        require(msg.value > highestBid, "Bid must be higher than current highest bid");

        if (highestBid != 0) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
        emit BidPlaced(msg.sender, msg.value);
    }

    function endAuction() external onlyOwner {
        require(!ended, "Auction has already ended");
        ended = true;
        owner.transfer(highestBid);
        emit AuctionEnded(highestBidder, highestBid);
    }
}