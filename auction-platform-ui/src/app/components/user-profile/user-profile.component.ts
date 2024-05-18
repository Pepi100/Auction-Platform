// user-profile.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() userAddress!: string;
  @Output() userProfileUpdated = new EventEmitter<any>();
  userEmail: string = "";
  totalBids: number = 0;
  totalAuctions: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile(this.userAddress).subscribe(profile => {
      this.userEmail = profile[0];
      this.totalBids = parseInt(profile[1]);
      this.totalAuctions = parseInt(profile[2]);
    });
  }

  updateProfile() {
    this.userService.updateProfile(this.userAddress, this.userEmail).subscribe(() => {
      this.loadProfile();
      this.userProfileUpdated.emit();
    });
  }

  async newUser() {
    this.userService.newUser(this.userAddress).subscribe(() => {
      this.loadProfile();
      this.userProfileUpdated.emit();
    });
  }

  async newAuction() {
    this.userService.newAuction(this.userAddress).subscribe(() => {
      this.loadProfile();
      this.userProfileUpdated.emit();
    });
  }

  async newBid() {
    this.userService.userProfileContract(this.userAddress).subscribe(() => {
      this.loadProfile();
      this.userProfileUpdated.emit();
    });
  }
}



