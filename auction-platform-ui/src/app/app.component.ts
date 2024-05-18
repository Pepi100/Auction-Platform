import { Component, OnInit } from '@angular/core';
import { Web3Service } from './services/web3.service';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  address: string | null = null;
  balance: string | null = null;

  constructor(private web3Service: Web3Service) {}

  async ngOnInit() {
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      this.address = savedAddress;
      await this.loadBalance(savedAddress);
    } else {
      await this.checkMetaMaskConnection();
    }
  }

  async checkMetaMaskConnection() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await this.web3Service.web3.eth.getAccounts();
        if (accounts.length > 0) {
          const userAccount = accounts[0];
          console.log('Reconnected account:', userAccount);
          this.address = userAccount;
          localStorage.setItem('userAddress', userAccount);
          await this.loadBalance(userAccount);
        }
      } else {
        console.log('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
    }
  }

  async connectToMetaMask() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await this.web3Service.web3.eth.getAccounts();
        const userAccount = accounts[0];
        console.log('Connected account:', userAccount);
        this.address = userAccount;
        localStorage.setItem('userAddress', userAccount);
        await this.loadBalance(userAccount);
      } else {
        console.log('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  }

  async loadBalance(address: string) {
    try {
      const balanceInWei = await this.web3Service.web3.eth.getBalance(address);
      console.log('Balance in Wei:', balanceInWei);
      this.balance = this.web3Service.web3.utils.fromWei(balanceInWei, 'ether');
      console.log('Balance:', this.balance, 'SepoliaETH');
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  }
  
  

  disconnect() {
    this.address = null;
    this.balance = null;
    localStorage.removeItem('userAddress');
    console.log('Disconnected from MetaMask');
  }
}
