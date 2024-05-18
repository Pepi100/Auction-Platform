// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract UserProfile {

    struct UserProf {
        string email;
        uint totalBids;
        uint totalAuctions;
    }

    mapping(address => UserProf) private profiles;
    mapping(address => bool) userExists;

    function updateProfile(address _address, string memory _email) external {
        require(userExists[_address], "That user does not exist!");
        profiles[msg.sender].email = _email;
    }


    function newAuction(address _address) external {
        require(userExists[_address], "That user does not exist!");
        profiles[_address].totalAuctions = profiles[_address].totalAuctions + 1;

    }

    function newBid(address _address) external {
        require(userExists[_address], "That user does not exist!");
        profiles[_address].totalBids = profiles[_address].totalBids + 1;
    }


    function newUser() external {
        require(!userExists[msg.sender], "That user already exists!");
        profiles[msg.sender] = UserProf({
            email: "",
            totalBids: 0,
            totalAuctions: 0
        });

        userExists[msg.sender] = true;
    }


    // getters
    function getProfile(address userAddress) public view returns (string memory, uint, uint) {
        UserProf memory profile = profiles[userAddress];
        return (profile.email, profile.totalBids, profile.totalAuctions);
    }




}