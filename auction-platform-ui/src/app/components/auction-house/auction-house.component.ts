import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import { auctionHouseContractABI } from '../../contracts/auction-house-abi';

@Component({
  selector: 'app-auction-house',
  templateUrl: './auction-house.component.html',
  styleUrls: ['./auction-house.component.scss']
})
export class AuctionHouseComponent implements OnInit {
  web3: any;
  auctionHouseContract: any;
  contractAddress = '0x43f921FC87C063966dd2b35E0094c0affd80aF39';
  auctions: any[] = [];
  owner: any;
  userAddress: any;
  newAuctionItem: any;
  newAuctionDuration: any;
  houseBalance: any;
  houseFee: any;
  currentTimestamp: any;
  bidAmounts: any[] = [];

  constructor() {}

  async ngOnInit() {
    if (typeof (window as any).ethereum !== 'undefined') {
      this.web3 = new Web3((window as any).ethereum);
      await (window as any).ethereum.enable();
      this.userAddress = (await this.web3.eth.getAccounts())[0];
    } else {
      console.error('Please install MetaMask to interact with this application');
      return;
    }

    this.auctionHouseContract = new this.web3.eth.Contract(auctionHouseContractABI, this.contractAddress);
    this.loadAuctions();
    this.loadOwner();
    this.loadHouseDetails();
    await this.loadCurrentTimestamp();

    this.auctionHouseContract.events.AuctionCreated()
      .on('data', (event: any) => this.handleAuctionCreated(event))
      .on('error', console.error);

    this.auctionHouseContract.events.BidPlaced()
      .on('data', (event: any) => this.handleBidPlaced(event))
      .on('error', console.error);

    this.auctionHouseContract.events.AuctionEnded()
      .on('data', (event: any) => this.handleAuctionEnded(event))
      .on('error', console.error);
  }

  async loadAuctions() {
    const numAuctions = await this.auctionHouseContract.methods.getNumAuctions().call();
    this.auctions = [];
    for (let i = 1; i <= numAuctions; i++) {
      const auction = await this.auctionHouseContract.methods.getAuction(i).call();
      auction.showHighestBid = false;
      auction.showAllBids = false;
      auction.highestBid = null;
      auction.bidAmount = '';
      auction.startTimeFormatted = this.formatTimestamp(auction.startTime);
      auction.endTimeFormatted = this.formatTimestamp(auction.endTime);
      auction.isActive = await this.isAuctionActive(auction.endTime);
      this.auctions.push(auction);
    }
  }

  async loadOwner() {
    this.owner = await this.auctionHouseContract.methods.getOwner().call();
  }

  async loadHouseDetails() {
    const balance = await this.auctionHouseContract.methods.getBalance().call({ from: this.userAddress });
    this.houseBalance = this.web3.utils.fromWei(balance, 'ether');
    this.houseFee = await this.auctionHouseContract.methods.houseFee().call();
  }

  async loadCurrentTimestamp() {
    this.currentTimestamp = await this.auctionHouseContract.methods.getCurrentTime().call();
  }

  async createAuction() {
    const startTime = this.currentTimestamp;
    const endTime = startTime + BigInt(this.newAuctionDuration * 60);

    await this.auctionHouseContract.methods.createAuction(this.newAuctionItem, startTime, endTime)
      .send({ from: this.userAddress });
    this.loadAuctions();
  }

  async showHighestBid(index: number) {
    const auction = this.auctions[index];
    if (auction.bids.length > 0) {
      const highestBid = await this.auctionHouseContract.methods.getHighestBid(index + 1).call();
      auction.highestBid = highestBid;
    } else {
      auction.highestBid = 0;
    }
    auction.showHighestBid = true;
  }

  async toggleAllBids(index: number) {
    const auction = this.auctions[index];
    auction.showAllBids = !auction.showAllBids;
  }

  async placeBid(index: number) {
    const bidAmount = this.auctions[index].bidAmount;
    const weiAmount = this.web3.utils.toWei(bidAmount, 'ether');

    await this.auctionHouseContract.methods.bid(index + 1).send({
      from: this.userAddress,
      value: weiAmount
    });
    this.loadAuctions();
  }

  handleAuctionCreated(event: any) {
    this.loadAuctions();
  }

  handleBidPlaced(event: any) {
    this.loadAuctions();
  }

  handleAuctionEnded(event: any) {
    this.loadAuctions();
  }

  async isAuctionActive(endTime: any): Promise<boolean> {
    const currentTime = await this.auctionHouseContract.methods.getCurrentTime().call();
    return currentTime < endTime;
  }

  formatTimestamp(timestamp: any): string {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  }
}
