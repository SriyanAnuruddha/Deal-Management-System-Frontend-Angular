import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../components/navbar/navbar';

import { RouterLink } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdminHotel } from '../../../components/admin-hotel/admin-hotel';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Hotel {
  id: string;
  name: string;
  rate: number;
  amenities: string;
  deals: null;
}

interface AuthUser {
  username: string;
  role: string;
  token: string;
}

@Component({
  selector: 'app-manage-hotels-page',
  imports: [Navbar, RouterLink, CommonModule, AdminHotel],
  templateUrl: './manage-hotels-page.html',
  styleUrl: './manage-hotels-page.scss',
})
export class ManageHotelsPage implements OnInit {
  hotels$!: Observable<Hotel[]>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('ManageHotelsPage: ngOnInit called. Starting data fetch.');
    this.getAllHotels();
  }

  getAllHotels(): void {
    const authUserString = localStorage.getItem('authUser');
    let authToken: string | null = null;

    if (authUserString) {
      try {
        const authUser: AuthUser = JSON.parse(authUserString);
        authToken = authUser.token;
      } catch (e) {
        console.error(
          'ManageHotelsPage: Error parsing authUser from localStorage during fetch:',
          e
        );
        alert('Could not retrieve authentication token. Please log in again.');
        this.hotels$ = of([]);
        return;
      }
    } else {
      alert('Authentication token not found. Please log in.');
      this.hotels$ = of([]);
      return;
    }

    if (!authToken) {
      alert('Authentication token is missing. Please log in.');
      this.hotels$ = of([]);
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    this.hotels$ = this.http
      .get<Hotel[]>('https://localhost:7152/api/hotels', { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('ManageHotelsPage: Error fetching hotels:', error);
          let errorMessage =
            'Failed to fetch hotels. Please check the console for details.';

          if (error.status === 401) {
            errorMessage = 'Unauthorized: Please log in again.';
          } else if (error.status === 403) {
            errorMessage =
              'Forbidden: You do not have permission to view hotels.';
          } else if (error.message) {
            errorMessage = `Error: ${error.message}`;
          }
          alert(errorMessage);
          return of([]);
        })
      );
  }

  onHotelDeleted(deletedHotelId: string): void {
    console.log(
      `Hotel with ID ${deletedHotelId} was deleted. Re-fetching hotels.`
    );
    this.getAllHotels();
  }
}
