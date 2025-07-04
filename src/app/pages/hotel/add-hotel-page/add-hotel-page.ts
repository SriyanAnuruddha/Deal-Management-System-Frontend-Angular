import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../components/navbar/navbar';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

interface AuthUser {
  username: string;
  role: string;
  token: string;
}

interface ValidationErrorResponse {
  type: string;
  title: string;
  status: number;
  errors: {
    [key: string]: string[];
  };
  traceId?: string;
}

@Component({
  selector: 'app-add-hotel-page',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-hotel-page.html',
  styleUrl: './add-hotel-page.scss',
})
export class AddHotelPage implements OnInit {
  addHotelForm!: FormGroup;

  hotelName: string = '';
  rate: number | null = null;
  amenities: string = '';

  apiErrors: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addHotelForm = this.fb.group({
      hotelNameControl: ['', Validators.required],
      rateControl: [null, [Validators.required, Validators.min(0)]],
      amenitiesControl: [''],
    });
  }

  addHotel() {
    this.apiErrors = null;

    this.addHotelForm.get('hotelNameControl')?.patchValue(this.hotelName);
    this.addHotelForm.get('rateControl')?.patchValue(this.rate);
    this.addHotelForm.get('amenitiesControl')?.patchValue(this.amenities);

    this.addHotelForm.markAllAsTouched();
    this.addHotelForm.get('hotelNameControl')?.updateValueAndValidity();
    this.addHotelForm.get('rateControl')?.updateValueAndValidity();
    this.addHotelForm.get('amenitiesControl')?.updateValueAndValidity();

    if (this.addHotelForm.invalid) {
      let validationMessage = '';
      if (this.addHotelForm.get('hotelNameControl')?.errors?.['required']) {
        validationMessage += 'Hotel name is required.\n';
      }
      if (this.addHotelForm.get('rateControl')?.errors?.['required']) {
        validationMessage += 'Rate is required.\n';
      }
      if (this.addHotelForm.get('rateControl')?.errors?.['min']) {
        validationMessage += 'Rate must be a positive number.\n';
      }

      if (validationMessage) {
        alert('Validation Errors:\n' + validationMessage);
      } else {
        alert('Please fill in all required fields correctly.');
      }
      return;
    }

    const hotelData = {
      name: this.hotelName,
      rate: this.rate,
      amenities: this.amenities,
    };

    const authUserString = localStorage.getItem('authUser');
    let authToken: string | null = null;

    if (authUserString) {
      try {
        const authUser: AuthUser = JSON.parse(authUserString);
        authToken = authUser.token;
      } catch (e) {
        console.error('Error parsing authUser from localStorage:', e);
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

    this.http
      .post('https://localhost:7152/api/hotels', hotelData, { headers })
      .subscribe({
        next: (response: any) => {
          alert('Hotel successfully added!');
          console.log('API Response:', response);

          this.hotelName = '';
          this.rate = null;
          this.amenities = '';

          this.addHotelForm.reset();

          this.router.navigate(['manage-hotels']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding hotel:', error);

          let errorMessage =
            'Failed to add hotel. Please check the console for details.';

          if (
            error.status === 400 &&
            error.error &&
            typeof error.error === 'object'
          ) {
            const validationError = error.error as ValidationErrorResponse;
            if (validationError.errors) {
              errorMessage =
                validationError.title ||
                'One or more validation errors occurred.';
              errorMessage += '\nDetails:\n';

              for (const key in validationError.errors) {
                if (validationError.errors.hasOwnProperty(key)) {
                  const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                  errorMessage += `- ${fieldName}: ${validationError.errors[
                    key
                  ].join(', ')}\n`;
                }
              }
            } else if (validationError.title) {
              errorMessage = `Bad Request: ${validationError.title}`;
            }
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized: Please log in again.';
          } else if (error.status === 403) {
            errorMessage =
              'Forbidden: You do not have permission to perform this action.';
          } else if (error.message) {
            errorMessage = `Error: ${error.message}`;
          }

          alert(errorMessage);
        },
      });
  }
}
