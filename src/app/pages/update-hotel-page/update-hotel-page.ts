import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-hotel-page',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './update-hotel-page.html',
  styleUrl: './update-hotel-page.scss',
})
export class UpdateHotelPage implements OnInit {
  hotelData: any = null;
  apiErrors: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('name');
    const rate = parseFloat(this.route.snapshot.paramMap.get('rate') || '0');
    const amenities = this.route.snapshot.paramMap.get('amenities');

    if (id && name && !isNaN(rate) && amenities) {
      this.hotelData = {
        id: id,
        name: name,
        rate: rate,
        amenities: amenities,
      };
    } else {
      console.error('Incomplete or invalid hotel data received from URL.');
      this.apiErrors = {
        general:
          'Could not load hotel details. Please ensure URL is correct or try again.',
      };
    }
  }

  updateHotel(): void {
    if (!this.hotelData) {
      console.error('No hotel data to update.');
      this.apiErrors = { general: 'No hotel data available for update.' };
      return;
    }

    this.apiErrors = null;

    const authUserString = localStorage.getItem('authUser');
    let authToken: any = null;

    if (authUserString) {
      try {
        const authUser: any = JSON.parse(authUserString);
        authToken = authUser.token;
      } catch (e) {
        console.error('Error parsing authUser from localStorage:', e);
        this.apiErrors = {
          general: 'Authentication error. Please log in again.',
        };
        return;
      }
    } else {
      this.apiErrors = {
        general: 'Authentication token not found. Please log in.',
      };
      return;
    }

    if (!authToken) {
      this.apiErrors = {
        general: 'Authentication token is missing. Please log in.',
      };
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    const updateUrl = `https://localhost:7152/api/hotels/${this.hotelData.id}`;

    this.http.put(updateUrl, this.hotelData, { headers }).subscribe({
      next: (response: any) => {
        alert(`Hotel "${this.hotelData?.name}" updated successfully!`);
        this.router.navigate(['/manage-hotels']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating hotel:', error);

        if (error.status === 400 && error.error && error.error.errors) {
          const backendErrors: any = error.error.errors;
          this.apiErrors = { ...backendErrors };

          if (this.apiErrors.Name) {
            this.apiErrors.Name = this.apiErrors.Name[0];
          }
          if (this.apiErrors.Rate) {
            this.apiErrors.Rate = this.apiErrors.Rate[0];
          }
          if (this.apiErrors.Amenities) {
            this.apiErrors.Amenities = this.apiErrors.Amenities[0];
          }

          alert('Validation Error: Please check the form for invalid input.');
        } else if (error.status === 401) {
          this.apiErrors = { general: 'Unauthorized: Please log in again.' };
        } else if (error.status === 403) {
          this.apiErrors = {
            general: 'Forbidden: You do not have permission to update hotels.',
          };
        } else if (error.message) {
          this.apiErrors = { general: `Error: ${error.message}` };
        } else {
          this.apiErrors = {
            general: 'Failed to update hotel. Please try again.',
          };
        }
      },
    });
  }
}
