import { Component } from '@angular/core';
import { Web3Service } from './services/web3.service';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private web3Service: Web3Service) {}

  async connectToMetaMask() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await this.web3Service.web3.eth.getAccounts();
        const userAccount = accounts[0];
        console.log('Connected account:', userAccount);
      } else {
        console.log('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  }
}
