import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuctionHouseComponent } from './components/auction-house/auction-house.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'auction-house', component: AuctionHouseComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
