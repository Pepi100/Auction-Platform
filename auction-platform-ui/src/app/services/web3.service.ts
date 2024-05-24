import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  web3: any;

  constructor() {
    this.initializeWeb3();
  }

  private async initializeWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        this.web3 = new Web3(window.ethereum);
      } catch (error) {
        console.error('Error initializing Web3 with MetaMask:', error);
      }
    } else {
      console.log('MetaMask is not installed');
    }
  }
}
