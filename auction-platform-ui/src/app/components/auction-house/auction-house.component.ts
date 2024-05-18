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
  newAuctionDuration: any;  // in minutes
  bidAmount: any;
  highestBid: { value: number; bidder: string; } | undefined;
  showBids: boolean[] = [];
  houseBalance: any;
  houseFee: any;
  currentTimestamp: any;

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

    // Subscribe to events
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
    this.showBids = new Array(numAuctions).fill(false);
    for (let i = 1; i <= numAuctions; i++) {
      const auction = await this.auctionHouseContract.methods.getAuction(i).call();
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
    console.log(this.houseFee);
  }

  async loadCurrentTimestamp() {
    this.currentTimestamp = await this.auctionHouseContract.methods.getCurrentTime().call();
  }

  async createAuction() {
    const startTime = this.currentTimestamp;
    const endTime = startTime + BigInt(this.newAuctionDuration * 60); // Convert the result to BigInt

    await this.auctionHouseContract.methods.createAuction(this.newAuctionItem, startTime, endTime)
      .send({ from: this.userAddress });
    this.loadAuctions();
    console.log("Auction created");
}


  async placeBid(auctionId: number) {
    await this.auctionHouseContract.methods.bid(auctionId)
      .send({ from: this.userAddress, value: this.web3.utils.toWei(this.bidAmount.toString(), 'ether') });
    this.loadAuctions();
  }

  async getHighestBid(auctionId: number) {
    this.highestBid = await this.auctionHouseContract.methods.getHighestBid(auctionId).call();
  }

  toggleBids(index: number) {
    this.showBids[index] = !this.showBids[index];
  }

  handleAuctionCreated(event: any) {
    console.log('AuctionCreated event:', event);
    this.loadAuctions();
  }

  handleBidPlaced(event: any) {
    console.log('BidPlaced event:', event);
    this.loadAuctions();
  }

  handleAuctionEnded(event: any) {
    console.log('AuctionEnded event:', event);
    this.loadAuctions();
  }
}
