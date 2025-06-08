import { Injectable } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(private router: Router) {}

  logOut() {
    localStorage.removeItem('authUser');
    this.router.navigate(['']);
  }
}
