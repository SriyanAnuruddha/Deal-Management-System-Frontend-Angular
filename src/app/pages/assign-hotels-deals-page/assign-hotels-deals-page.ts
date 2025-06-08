import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { Navbar } from '../../components/navbar/navbar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdminAssignHotel } from '../../components/admin-assign-hotel/admin-assign-hotel';

interface Hotel {
  id: string;
  name: string;
  rate: number;
  amenities: string;
  deals: null;
}

@Component({
  selector: 'app-assign-hotels-deals-page',
  standalone: true,
  imports: [Navbar, CommonModule, AdminAssignHotel],
  templateUrl: './assign-hotels-deals-page.html',
  styleUrl: './assign-hotels-deals-page.scss',
})
export class AssignHotelsDealsPage implements OnInit {
  dealId: string | null = null;
  availableHotels: Hotel[] = [];
  selectedHotelIds: Set<string> = new Set<string>();
  apiErrors: any = null;
  isLoading: boolean = true;

  private hotelsApiUrl = 'https://localhost:7152/api/hotels';
  private dealAssignApiBaseUrl = 'https://localhost:7152/api/deal';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.dealId = params.get('id');
      if (this.dealId) {
        this.fetchAllAvailableHotels();
      } else {
        this.apiErrors = { general: 'Deal ID not provided in URL.' };
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection here too
      }
    });
  }

  fetchAllAvailableHotels(): void {
    this.isLoading = true;
    this.apiErrors = null;

    const authUserString = localStorage.getItem('authUser');
    let authToken: string | null = null;

    if (authUserString) {
      try {
        const authUser = JSON.parse(authUserString);
        authToken = authUser.token;
      } catch (e) {
        this.apiErrors = {
          general: 'Authentication error. Please log in again.',
        };
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection
        return;
      }
    }

    if (!authToken) {
      this.apiErrors = {
        general: 'Authentication token not found. Please log in.',
      };
      this.isLoading = false;
      this.cdr.detectChanges(); // Trigger change detection
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    });

    this.http.get<Hotel[]>(this.hotelsApiUrl, { headers }).subscribe({
      next: (data: Hotel[]) => {
        if (Array.isArray(data)) {
          this.availableHotels = data;
        } else {
          this.apiErrors = { general: 'Unexpected format for hotels data.' };
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection after data is set and loading is false
      },
      error: (error: HttpErrorResponse) => {
        this.apiErrors = {
          general: `Failed to load hotels: ${
            error.message || 'Unknown error'
          }. Status: ${error.status}`,
        };
        if (error.status === 401 || error.status === 403) {
          this.apiErrors.general =
            'Authorization error. Please check your login status.';
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection on error
      },
    });
  }

  onHotelCheckboxChange(event: { hotelId: string; checked: boolean }): void {
    if (event.checked) {
      this.selectedHotelIds.add(event.hotelId);
    } else {
      this.selectedHotelIds.delete(event.hotelId);
    }
    this.cdr.detectChanges(); // Force change detection on selection change
  }

  assignHotelsToDeal(): void {
    this.apiErrors = null;

    if (!this.dealId) {
      this.apiErrors = { general: 'Deal ID is missing for assignment.' };
      this.cdr.detectChanges();
      return;
    }

    const authUserString = localStorage.getItem('authUser');
    let authToken: string | null = null;

    if (authUserString) {
      try {
        const authUser = JSON.parse(authUserString);
        authToken = authUser.token;
      } catch (e) {
        alert('Authentication error. Please log in again.');
        this.cdr.detectChanges();
        return;
      }
    } else {
      alert('Authentication token not found. Please log in.');
      this.cdr.detectChanges();
      return;
    }

    if (!authToken) {
      alert('Authentication token is missing. Please log in.');
      this.cdr.detectChanges();
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    });

    const requestBody = {
      hotelIds: Array.from(this.selectedHotelIds),
    };

    this.http
      .put(
        `${this.dealAssignApiBaseUrl}/${this.dealId}/addhotels`,
        requestBody,
        { headers }
      )
      .subscribe({
        next: (response: any) => {
          alert('Hotels assigned to deal successfully!');
          this.router.navigate(['/manage-deals']);
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.apiErrors = {
              general: 'Unauthorized: Please log in again to assign hotels.',
            };
          } else if (error.status === 403) {
            this.apiErrors = {
              general:
                'Forbidden: You do not have permission to assign hotels.',
            };
          } else if (error.status === 404) {
            this.apiErrors = {
              general: 'Deal or hotels not found during assignment.',
            };
          } else {
            this.apiErrors = {
              general: `Failed to assign hotels: ${
                error.message || 'Unknown error'
              }. Status: ${error.status}`,
            };
          }
          alert(
            `Failed to assign hotels. Error: ${
              this.apiErrors.general || error.message || 'Unknown error'
            }`
          );
          this.cdr.detectChanges();
        },
      });
  }
}
