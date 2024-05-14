// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./Auction.sol";

contract AuctionHouse {
    
    address public owner;
    uint public numAuctions;
    uint8 public houseFee;
    mapping(uint => address) public auctions;

    event AuctionCreated(uint indexed auctionId, address indexed auctionAddress);

    constructor(uint _houseFee) {
        require(_houseFee <= 100 || _houseFee >= 0, "House fee must be between 0 and 100");
        owner = msg.sender;
        uint8 houseFee = uint8(_houseFee);

    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createAuction(string memory auctionItem) external {
        Auction newAuction = new Auction(payable(msg.sender), auctionItem);
        auctions[numAuctions] = address(newAuction);
        emit AuctionCreated(numAuctions, address(newAuction));
        numAuctions++;
    }

    function bidAuction(uint id) external payable {
        require(id < numAuctions,"Auction doesn't exist!");
        Auction auc = Auction(auctions[id]);
        
        // TODO / TOTEST
        (bool success, ) = address(auc).call{value: msg.value}(
            abi.encodeWithSignature("placeBid()")
        );
        require(success, "Failed to place bid in auction");
    }

    function payoutPrice(uint price, uint fee) private pure returns (uint){
        return price * (100 - fee) / 100;
    }
    

// GETTERS
    function getNumAuctions() external view returns (uint) {
        return numAuctions;
    }

    function getAuction(uint id) external view returns(address){
        return auctions[id];
    }

    function getOwner() external view returns (address) {
        return owner;
    }



}