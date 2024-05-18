import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import Web3 from 'web3';
import { Observable, from } from 'rxjs';
import { userProfileContractABI } from '../contracts/user-profile-abi';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  web3: any;
  userProfileContract: any;
  contractAddress = '0xF38e58C727DE3D0F1EB932E3D70d736068728d16';

  constructor(private web3Service: Web3Service) {
    this.initializeWeb3();
  }

  private async initializeWeb3() {
    if (typeof (window as any).ethereum !== 'undefined') {
      this.web3 = new Web3((window as any).ethereum);
      await (window as any).ethereum.enable();
    } else {
      console.error('Please install MetaMask to interact with this application');
      return;
    }
    
    this.userProfileContract = new this.web3.eth.Contract(userProfileContractABI, this.contractAddress);
  }

  getProfile(userAddress: string): Observable<any> {
    return from(this.userProfileContract.methods.getProfile(userAddress).call());
  }

  updateProfile(userAddress: string, userEmail: string): Observable<any> {
    return from(this.userProfileContract.methods.updateProfile(userAddress, userEmail).send({ from: userAddress }));
  }

  newUser(userAddress: string): Observable<any> {
    return from(this.userProfileContract.methods.newUser().send({ from: userAddress }));
  }

  newAuction(userAddress: string): Observable<any> {
    return from(this.userProfileContract.methods.newAuction(userAddress).send({ from: userAddress }));
  }

  newBid(userAddress: string): Observable<any> {
    return from(this.userProfileContract.methods.newBid(userAddress).send({ from: userAddress }));
  }
}
