// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;


interface UserProfileInterface {
    function newBid(address _address) external;

    function newAuction(address _address) external;
    
}

contract AuctionHouse {
    address public owner;
    uint256 private numAuctions;
    uint8 private houseFee;
    UserProfileInterface public userProfile;


    struct Auction {
        address payable auctionOwner;
        string auctionItem;
        uint256 startTime;
        uint256 endTime;
        address[] bidders;
        uint256[] bids;
    }

    mapping(uint256 => Auction) private auctions;



    event AuctionCreated(uint256 indexed auctionId, string auctionItem);
    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );
    event AuctionEnded(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 amount
    );

    // MODIFIERS
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier notZero() {
        require(msg.value != 0, "Bid must be higher than 0");
        _;
    }


    // ACTIONS
    constructor(uint256 _houseFee) {
        require(
            _houseFee <= 100 || _houseFee >= 0,
            "House fee must be between 0 and 100"
        );
        owner = payable(msg.sender);
        houseFee = uint8(_houseFee);
        userProfile = UserProfileInterface(0xF38e58C727DE3D0F1EB932E3D70d736068728d16);

    }

    function createAuction(
        string calldata _auctionItem,
        uint256 _startTime,
        uint256 _endTime
    ) external {
        require(_startTime < _endTime, "Start time must be before end time");

        
        numAuctions++;

        

        uint256[] memory emptyArray;
        address[] memory emptyAddresses;

        auctions[numAuctions] = Auction(
            payable(msg.sender),
            _auctionItem,
            _startTime,
            _endTime,
            emptyAddresses,
            emptyArray
        );

        userProfile.newAuction(msg.sender);

        
        emit AuctionCreated(numAuctions, _auctionItem);
    }

    function bid(uint256 auctionId) external payable notZero{
        require(
            auctionId <= numAuctions && auctionId > 0,
            "That auction doesn't exist"
        );
        Auction storage auc = auctions[auctionId];
        require(
            auc.startTime <= block.timestamp && block.timestamp <= auc.endTime,
            "That auction is not active"
        );

        if (auc.bids.length > 0) {
            require(
                auc.bids[auc.bids.length - 1] < msg.value,
                "That bid is too small"
            );

            
            address previousBidder = auc.bidders[auc.bids.length - 1];
            uint256 previousValue = auc.bids[auc.bids.length - 1];
            payable(previousBidder).transfer(previousValue);
        }

        
        auc.bids.push(msg.value);
        auc.bidders.push(msg.sender);

        userProfile.newBid(msg.sender);

        
        emit BidPlaced(auctionId, msg.sender, msg.value);
    }


    function collectPayout(uint auctionId) external {
        require(
            auctionId <= numAuctions && auctionId > 0,
            "That auction doesn't exist"
        );

        require (msg.sender == auctions[auctionId].auctionOwner, "You are not the owner of this auction");
        uint value;
        address  add;
        (value, add)= getHighestBid(auctionId);
        auctions[auctionId].auctionOwner.transfer(payoutPrice(value,houseFee));
    }


// PURE
    function payoutPrice(uint256 price, uint256 fee)
        private
        pure
        returns (uint256)
    {
        return (price * (100 - fee)) / 100;
    }

// GETTERS
    function getAuction(uint256 auctionId)
        external
        view
        returns (
            address auctionOwner,
            string memory auctionItem,
            uint256 startTime,
            uint256 endTime,
            uint256[] memory bids,
            address[] memory bidders
        )
    {
        require(
            auctionId <= numAuctions && auctionId > 0,
            "Invalid auction ID"
        );
        Auction storage auction = auctions[auctionId];

        return (
            auction.auctionOwner,
            auction.auctionItem,
            auction.startTime,
            auction.endTime,
            auction.bids,
            auction.bidders
        );
    }

    function getHighestBid(uint256 auctionId)
        public
        view
        returns (uint256 value, address bidder)
    {
        require(
            auctionId <= numAuctions && auctionId > 0,
            "That auction doesn't exist"
        );
        Auction storage auc = auctions[auctionId];

        require(auc.bids.length > 0, "No bids placed yet");

        return (
            auc.bids[auc.bids.length - 1],
            auc.bidders[auc.bids.length - 1]
        );
    }

    function getNumAuctions() external view returns (uint256) {
        return numAuctions;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function getHouseFee() external view returns (uint) {
        return houseFee;
    }

    function getBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function getCurrentTime() public view returns (uint256){
        return block.timestamp;
    }

}
