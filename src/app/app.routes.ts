import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { UserHomePage } from './pages/user-home-page/user-home-page';
import { AdminHomePage } from './pages/admin-home-page/admin-home-page';
import { SignupPage } from './pages/signup-page/signup-page';

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
];
