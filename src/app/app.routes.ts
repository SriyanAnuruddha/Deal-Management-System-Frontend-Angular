import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { UserHomePage } from './pages/user-home-page/user-home-page';
import { AdminHomePage } from './pages/admin-home-page/admin-home-page';
import { SignupPage } from './pages/signup-page/signup-page';
import { ManageHotelsPage } from './pages/manage-hotels-page/manage-hotels-page';
import { ManageDealsPage } from './pages/manage-deals-page/manage-deals-page';
import { AddHotelPage } from './pages/add-hotel-page/add-hotel-page';
import { UpdateHotelPage } from './pages/update-hotel-page/update-hotel-page';

export const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
  {
    path: 'user',
    component: UserHomePage,
  },
  {
    path: 'admin',
    component: AdminHomePage,
  },
  {
    path: 'signup',
    component: SignupPage,
  },
  {
    path: 'manage-hotels',
    component: ManageHotelsPage,
  },
  {
    path: 'manage-deals',
    component: ManageDealsPage,
  },
  {
    path: 'add-hotels',
    component: AddHotelPage,
  },
  {
    path: 'update-hotels/:id/:name/:rate/:amenities',
    component: UpdateHotelPage,
  },
];
