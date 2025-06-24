import { Component, OnInit, ViewChild } from '@angular/core';
import { Navbar } from '../../../components/navbar/navbar';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgForm,
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAssignHotel } from '../../../components/admin-assign-hotel/admin-assign-hotel';

@Component({
  selector: 'app-add-deal-page',
  standalone: true,
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminAssignHotel,
  ],
  templateUrl: './add-deal-page.html',
  styleUrl: './add-deal-page.scss',
})
export class AddDealPage implements OnInit {
  dealForm!: FormGroup;

  dealName: any = '';
  videoFile: File | null = null;

  availableHotels: any[] = [];
  selectedHotelIds: string[] = [];
  apiErrors: any = null;

  private hotelsApiUrl = 'https://localhost:7152/api/hotels';
  private dealsApiUrl = 'https://localhost:7152/api/deal';

  @ViewChild('dealForm') ngForm!: NgForm;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dealForm = this.fb.group({
      dealName: ['', Validators.required],
      videoFileControl: [null, Validators.required],
    });

    this.fetchAvailableHotels();
  }

  fetchAvailableHotels(): void {
    const authUserString = localStorage.getItem('authUser');
    let authToken: string | null = null;

    if (authUserString) {
      try {
        const authUser: { token: string } = JSON.parse(authUserString);
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

  isHotelSelected(hotelId: string): boolean {
    return this.selectedHotelIds.includes(hotelId);
  }

  onHotelAssignmentChange(event: { hotelId: string; checked: boolean }): void {
    if (event.checked) {
      if (!this.selectedHotelIds.includes(event.hotelId)) {
        this.selectedHotelIds.push(event.hotelId);
      }
    } else {
      this.selectedHotelIds = this.selectedHotelIds.filter(
        (id: string) => id !== event.hotelId
      );
    }
    console.log('Selected Hotels:', this.selectedHotelIds);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0];
      this.dealForm.get('videoFileControl')?.patchValue(this.videoFile);
      this.dealForm.get('videoFileControl')?.updateValueAndValidity();
    } else {
      this.videoFile = null;
      this.dealForm.get('videoFileControl')?.patchValue(null);
      this.dealForm.get('videoFileControl')?.updateValueAndValidity();
    }
  }

  createDeal(): void {
    this.apiErrors = null;

    this.dealForm.get('dealName')?.patchValue(this.dealName);
    this.dealForm.get('dealName')?.updateValueAndValidity();

    this.dealForm.markAllAsTouched();
    if (this.ngForm) {
      this.ngForm.form.markAllAsTouched();
    }

    if (!this.videoFile) {
      this.apiErrors = {
        ...(this.apiErrors || {}),
        VideoFile: ['Please upload a video file for the deal.'],
      };
    }
    if (this.selectedHotelIds.length === 0) {
      this.apiErrors = {
        ...(this.apiErrors || {}),
        HotelIds: ['Please assign at least one hotel to this deal.'],
      };
    }

    if (
      this.dealForm.invalid ||
      !this.videoFile ||
      this.selectedHotelIds.length === 0 ||
      (this.apiErrors && (this.apiErrors.VideoFile || this.apiErrors.HotelIds))
    ) {
      if (this.dealForm.get('dealName')?.invalid && !this.apiErrors?.Name) {
        this.apiErrors = {
          ...(this.apiErrors || {}),
          Name: ['Deal name cannot be empty.'],
        };
      }
      return;
    }

    const authUserString = localStorage.getItem('authUser');
    let authToken: string | null = null;

    if (authUserString) {
      try {
        const authUser: { token: string } = JSON.parse(authUserString);
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

    this.selectedHotelIds.forEach((hotelId: string) => {
      formData.append('HotelIDs', hotelId);
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
      error: (error: HttpErrorResponse) => {
        console.error('AddDealPage: Error creating deal:', error);
        if (error.status === 400 && error.error && error.error.errors) {
          const backendErrors: any = error.error.errors;
          this.apiErrors = { ...backendErrors };

          if (this.ngForm && this.ngForm.controls['dealName']) {
            if (this.apiErrors.Name) {
              this.ngForm.controls['dealName'].setErrors({
                backend: this.apiErrors.Name[0],
              });
            }
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
