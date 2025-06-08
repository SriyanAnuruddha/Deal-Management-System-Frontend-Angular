import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
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
  selector: 'app-admin-hotel',
  imports: [],
  templateUrl: './admin-hotel.html',
  styleUrl: './admin-hotel.scss',
})
export class AdminHotel implements OnInit {
  @Input() hotel!: Hotel;

  @Output() hotelDeleted = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  deleteHotel(): void {
    if (
      !confirm(`Are you sure you want to delete hotel "${this.hotel.name}"?`)
    ) {
      return;
    }

    const authUserString = localStorage.getItem('authUser');
    let authToken: string | null = null;

    if (authUserString) {
      try {
        const authUser: AuthUser = JSON.parse(authUserString);
        authToken = authUser.token;
      } catch (e) {
        console.error(
          'AdminHotel: Error parsing authUser from localStorage:',
          e
        );
        alert('Could not retrieve authentication token. Please log in again.');
        return;
      }
    } else {
      alert('Authentication token not found. Please log in.');
      return;
    }

    if (!authToken) {
      alert('Authentication token is missing. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    const deleteUrl = `https://localhost:7152/api/hotels/${this.hotel.id}`;

    this.http.delete(deleteUrl, { headers, responseType: 'text' }).subscribe({
      next: (response: any) => {
        alert(`Hotel "${this.hotel.name}" deleted successfully!`);
        console.log('AdminHotel: Delete API Response:', response);
        this.hotelDeleted.emit(this.hotel.id);
      },
      error: (error: HttpErrorResponse) => {
        console.error('AdminHotel: Error deleting hotel:', error);
        let errorMessage =
          'Failed to delete hotel. Please check the console for details.';

        if (error.status === 401) {
          errorMessage = 'Unauthorized: Please log in again.';
        } else if (error.status === 403) {
          errorMessage =
            'Forbidden: You do not have permission to delete hotels.';
        } else if (error.status && error.status !== 0) {
          errorMessage = `Error ${error.status}: ${
            error.message || error.statusText
          }`;
        } else {
          errorMessage = 'Network error or server unavailable.';
        }
        alert(errorMessage);
      },
    });
  }
}
