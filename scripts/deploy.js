require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner] = await ethers.getSigners();

    let tokenFactory = await ethers.getContractFactory("AuctionHouse");
    let token = await tokenFactory.connect(owner).deploy(0);
    await token.deployed();
    console.log("AuctionHouse contract address: ", token.address)
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });