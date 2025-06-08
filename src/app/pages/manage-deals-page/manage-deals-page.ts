import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-deals-page',
  imports: [Navbar, RouterLink],
  templateUrl: './manage-deals-page.html',
  styleUrl: './manage-deals-page.scss',
})
export class ManageDealsPage {}
