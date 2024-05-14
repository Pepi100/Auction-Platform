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
  contractAddress = '0xE3731d24059c05F61A6f3816C3d764f14826F5EF'; 
  auctions: any[] = []; 
  owner: any;

  constructor() {}

  async ngOnInit() {
    if (typeof (window as any).ethereum !== 'undefined') {
      this.web3 = new Web3((window as any).ethereum);
      await (window as any).ethereum.enable();      
    } else {
      console.error('Please install MetaMask to interact with this application');
      return;
    }
    
    this.auctionHouseContract = new this.web3.eth.Contract(auctionHouseContractABI, this.contractAddress);

    await this.setOwner();
    await this.fetchAuctions();
  }

  
  async createAuction(auctionItem: string) {
    try {
      const accounts = await this.web3.eth.getAccounts(); 
      console.log('Creating auction with item:', auctionItem);
      const tx = await this.auctionHouseContract.methods.createAuction(auctionItem).send({ from: accounts[0] });
      console.log('Transaction hash:', tx.transactionHash);

      await this.fetchAuctions();
    } catch (error) {
      console.error('Error creating auction:', error);
    }
  }

  async bidAuction(auctionId: number, amount: number) {
    try {
      const accounts = await this.web3.eth.getAccounts(); 
      const tx = await this.auctionHouseContract.methods.bidAuction(auctionId).send({ from: accounts[0], value: amount });
      console.log('Transaction hash:', tx.transactionHash);
    } catch (error) {
      console.error('Error bidding on auction:', error);
    }
  }

  async fetchAuctions() {
    try {
      const numAuctions = await this.auctionHouseContract.methods.getNumAuctions().call(); 
      this.auctions = [];
      for (let i = 0; i < numAuctions; i++) {
        const auctionAddress = await this.auctionHouseContract.methods.getAuction(i).call(); 
        this.auctions.push(auctionAddress);
      }
    } catch (error) {
      console.error('Error retrieving auctions:', error);
    }
  }

  async setOwner() {
    try {
      this.owner = await this.auctionHouseContract.methods.getOwner().call(); 
    } catch (error) {
      console.error('Error retrieving owner:', error);
    }
  }

}
