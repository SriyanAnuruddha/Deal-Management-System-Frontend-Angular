import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { RouterLink, Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdminDeal } from '../../components/admin-deal/admin-deal';

@Component({
  selector: 'app-manage-deals-page',
  standalone: true,
  imports: [Navbar, RouterLink, CommonModule, AdminDeal],
  templateUrl: './manage-deals-page.html',
  styleUrl: './manage-deals-page.scss',
})
export class ManageDealsPage implements OnInit {
  deals: any[] = [];
  apiErrors: any = null;

  private dealsApiUrl = 'https://localhost:7152/api/deal';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAllDeals();
  }

  fetchAllDeals(): void {
    this.apiErrors = null;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.get(this.dealsApiUrl, { headers }).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.deals = data;
          this.cdr.detectChanges(); // Explicitly trigger change detection
        } else {
          this.apiErrors = {
            general: 'Unexpected API response format. Expected an array.',
          };
          this.deals = [];
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.apiErrors = {
            general: 'Unauthorized: Please log in again to view deals.',
          };
        } else if (error.status === 403) {
          this.apiErrors = {
            general: 'Forbidden: You do not have permission to view deals.',
          };
        } else {
          this.apiErrors = {
            general: `Failed to fetch deals: ${
              error.message || 'Unknown error'
            }. Status: ${error.status}`,
          };
        }
      },
    });
  }

  onDeleteDeal(dealId: string): void {
    if (
      !confirm(
        'Are you sure you want to delete this deal? This action cannot be undone.'
      )
    ) {
      return;
    }

    const authUserString = localStorage.getItem('authUser');
    let authToken: any = null;

    if (authUserString) {
      try {
        const authUser: any = JSON.parse(authUserString);
        authToken = authUser.token;
      } catch (e) {
        alert('Authentication error. Please log in again.');
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
      Authorization: `Bearer ${authToken}`,
    });

    const deleteUrl = `${this.dealsApiUrl}/${dealId}`;

    this.http
      .delete(deleteUrl, { headers, responseType: 'text' as 'json' })
      .subscribe({
        next: (response: any) => {
          alert(`Deal with ID: ${dealId} deleted successfully!`);
          // Instead of just filtering, re-fetch all deals to ensure fresh data
          this.fetchAllDeals(); // <--- CALL fetchAllDeals() here to refresh the list
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.apiErrors = {
              general: 'Unauthorized: Please log in again to delete deals.',
            };
          } else if (error.status === 403) {
            this.apiErrors = {
              general: 'Forbidden: You do not have permission to delete deals.',
            };
          } else if (error.status === 404) {
            this.apiErrors = {
              general: 'Deal not found. It might have already been deleted.',
            };
            // If 404, the deal is effectively gone, so refresh the list
            this.fetchAllDeals();
          } else {
            this.apiErrors = {
              general: `Failed to delete deal: ${
                error.message || 'Unknown error'
              }`,
            };
          }
          alert(
            `Failed to delete deal. Error: ${
              this.apiErrors.general || error.message || 'Unknown error'
            }`
          );
        },
      });
  }
}
