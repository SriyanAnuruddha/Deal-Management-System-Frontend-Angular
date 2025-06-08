import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminAssignHotel } from '../../components/admin-assign-hotel/admin-assign-hotel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-deal-page',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule, AdminAssignHotel],
  templateUrl: './add-deal-page.html',
  styleUrl: './add-deal-page.scss',
})
export class AddDealPage implements OnInit {
  dealName: any = '';
  videoFile: any = null;
  availableHotels: any[] = [];
  selectedHotelIds: any[] = [];
  apiErrors: any = null;

  private hotelsApiUrl = 'https://localhost:7152/api/hotels';
  private dealsApiUrl = 'https://localhost:7152/api/deal';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchAvailableHotels();
  }

  fetchAvailableHotels(): void {
    const authUserString = localStorage.getItem('authUser');
    let authToken: any = null;

    if (authUserString) {
      try {
        const authUser: any = JSON.parse(authUserString);
        authToken = authUser.token;
      } catch (e) {
        console.error(
          'AddDealPage: Error parsing authUser from localStorage:',
          e
        );
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

    this.http.get(this.hotelsApiUrl, { headers }).subscribe({
      next: (data: any) => {
        this.availableHotels = data;
      },
      error: (error: any) => {
        console.error('AddDealPage: Error fetching hotels:', error);
        if (error.status === 401) {
          this.apiErrors = {
            general: 'Unauthorized: Please log in again to fetch hotels.',
          };
        } else if (error.status === 403) {
          this.apiErrors = {
            general: 'Forbidden: You do not have permission to view hotels.',
          };
        } else {
          this.apiErrors = {
            general: `Failed to fetch hotels: ${
              error.message || 'Unknown error'
            }`,
          };
        }
      },
    });
  }

  // New method to check if a hotel is selected
  isHotelSelected(hotelId: string): boolean {
    return this.selectedHotelIds.some((item: any) => item.hotelId === hotelId);
  }

  onHotelAssignmentChange(event: any): void {
    if (event.checked) {
      // Add hotel ID if checked and not already present
      const exists = this.selectedHotelIds.some(
        (item: any) => item.hotelId === event.hotelId
      );
      if (!exists) {
        this.selectedHotelIds.push({ hotelId: event.hotelId });
      }
    } else {
      // Remove hotel ID if unchecked
      this.selectedHotelIds = this.selectedHotelIds.filter(
        (item: any) => item.hotelId !== event.hotelId
      );
    }
    console.log('Selected Hotels:', this.selectedHotelIds);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0];
    } else {
      this.videoFile = null;
    }
  }

  createDeal(): void {
    this.apiErrors = null;

    if (!this.dealName.trim()) {
      this.apiErrors = { Name: ['Deal name cannot be empty.'] };
      return;
    }
    if (!this.videoFile) {
      this.apiErrors = {
        VideoFile: ['Please upload a video file for the deal.'],
      };
      return;
    }
    if (this.selectedHotelIds.length === 0) {
      this.apiErrors = {
        HotelIds: ['Please assign at least one hotel to this deal.'],
      };
      return;
    }

    const authUserString = localStorage.getItem('authUser');
    let authToken: any = null;

    if (authUserString) {
      try {
        const authUser: any = JSON.parse(authUserString);
        authToken = authUser.token;
      } catch (e) {
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

    const formData = new FormData();
    formData.append('name', this.dealName);
    if (this.videoFile) {
      formData.append('videoFile', this.videoFile, this.videoFile.name);
    }

    this.selectedHotelIds.forEach((hotel: any) => {
      formData.append('HotelIDs', hotel.hotelId);
    });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });

    this.http.post(this.dealsApiUrl, formData, { headers }).subscribe({
      next: (response: any) => {
        alert('Deal created successfully!');
        console.log('Deal creation response:', response);
        this.router.navigate(['/manage-deals']);
      },
      error: (error: any) => {
        console.error('AddDealPage: Error creating deal:', error);
        if (error.status === 400 && error.error && error.error.errors) {
          const backendErrors: any = error.error.errors;
          this.apiErrors = { ...backendErrors };
          if (this.apiErrors.Name) {
            this.apiErrors.Name = this.apiErrors.Name[0];
          }
          if (this.apiErrors.VideoFile) {
            this.apiErrors.VideoFile = this.apiErrors.VideoFile[0];
          }
          if (this.apiErrors.HotelIds) {
            this.apiErrors.HotelIds = this.apiErrors.HotelIds[0];
          }
          alert('Validation Error: Please check the form for invalid input.');
        } else if (error.status === 401) {
          this.apiErrors = { general: 'Unauthorized: Please log in again.' };
        } else if (error.status === 403) {
          this.apiErrors = {
            general: 'Forbidden: You do not have permission to create deals.',
          };
        } else if (error.message) {
          this.apiErrors = { general: `Error: ${error.message}` };
        } else {
          this.apiErrors = {
            general: 'Failed to create deal. Please try again.',
          };
        }
      },
    });
  }
}
