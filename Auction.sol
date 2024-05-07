// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Auction {
    address payable public owner;
    string public auctionItem;
    uint startTime;
    uint endTime;
    

    struct Bid{
        address bidder;
        uint value;
    }

    Bid[] public bids;
    uint bidsNumber;

    // MODIFIERS
    modifier isActive() {
        uint currentTime = block.timestamp;
        require(currentTime >= startTime && currentTime <= endTime , "The auction is not currently active.");
        _;
    }

    modifier isHighest() {
        // what is msg here?
        require(bidsNumber == 0 || msg.value > bids[bidsNumber - 1].value, "Bid must be higher than current highest bid");
        _;
    }

    modifier notOwner() {
        // what is msg here?
        require(tx.origin != owner, "The owner cannot bid on his own auction.");
        _;
    }



    event BidPlaced(address indexed bidder, uint amount);
    event AuctionEnded(address indexed winner, uint amount);

    constructor(address payable _owner, string memory _auctionItem) {
        owner = _owner;
        auctionItem = _auctionItem;
        bidsNumber = 0;

        startTime = block.timestamp;
        endTime = startTime + 2 minutes;

    }

    

    function placeBid() external payable isActive isHighest notOwner{
        
        Bid memory newBid;
        newBid.bidder = msg.sender;
        newBid.value = msg.value;

        bids.push(newBid);

        bidsNumber += 1;

        uint currentTime = block.timestamp;
        if( endTime - currentTime < 10 minutes ){
            // extend auction time if below 10 minutes
            endTime = currentTime + 10 minutes;
        }

        emit BidPlaced(msg.sender, msg.value);
    }


    // GETTERS

    function getHighestBid() external view returns (Bid memory) {
        require(bidsNumber > 0, "No bids have been placed yet");
        return bids[bidsNumber - 1];
    }

    function getStartTime() external view returns (uint) {
        return startTime;
    }

    function getTimeLeft() external view returns (uint) {
        return Math.max(0, endTime - block.timestamp );
    }

    // memory vs storage, memory is erased, storaged is permanent on the blockchain
    function getAllBids() external view returns (Bid[] memory) {
        return bids;
    }

    function getContractBalance() public view returns(uint){
        return address(this).balance;
    }


}