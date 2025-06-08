import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoutService } from '../../services/logout-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  logoutService = inject(LogoutService);

  logOut() {
    this.logoutService.logOut();
  }
}
