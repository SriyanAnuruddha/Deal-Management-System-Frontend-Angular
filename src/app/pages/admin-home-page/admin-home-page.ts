import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home-page',
  imports: [Navbar, RouterLink],
  templateUrl: './admin-home-page.html',
  styleUrl: './admin-home-page.scss',
})
export class AdminHomePage {}
