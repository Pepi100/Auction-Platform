import { Component, OnInit } from '@angular/core';
import { Web3Service } from './services/web3.service';
import { UserService } from './services/user-profile.service';
import { ActivatedRoute, Router } from '@angular/router';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  address: string | null = null;
  balance: string | null = null;
  currentRoute!: string;

  constructor(private web3Service: Web3Service, private userService: UserService, public router: Router) {}

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
      if (this.web3Service.web3) {
        const accounts = await this.web3Service.web3.eth.getAccounts();
        if (accounts.length > 0) {
          const userAccount = accounts[0];
          console.log('Reconnected account:', userAccount);
          this.address = userAccount;
          localStorage.setItem('userAddress', userAccount);
          await this.loadBalance(userAccount);

          this.userService.getProfile(userAccount).subscribe((profile: any) => {
            if (profile[0] === '') {
              this.userService.newUser(userAccount).subscribe(() => {
                console.log('User created');
              });
            } else {
              console.log('User already exists');
            }
          });
        }
      } else {
        console.log('Web3Service is not initialized');
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
    }
  }

  async connectToMetaMask() {
    try {
      if (this.web3Service.web3) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await this.web3Service.web3.eth.getAccounts();
        const userAccount = accounts[0];
        console.log('Connected account:', userAccount);
        this.address = userAccount;
        localStorage.setItem('userAddress', userAccount);
        await this.loadBalance(userAccount);

        this.userService.getProfile(userAccount).subscribe((profile: any) => {
          if (profile[0] === '') {
            this.userService.newUser(userAccount).subscribe(() => {
              console.log('User created');
            });
          } else {
            console.log('User already exists');
          }
        });
      } else {
        console.log('Web3Service is not initialized');
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
