import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Deal } from '../../components/deal/deal';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-view-deals-page',
  standalone: true,
  imports: [CommonModule, Deal, Navbar],
  templateUrl: './view-deals-page.html',
  styleUrl: './view-deals-page.scss',
})
export class ViewDealsPage implements OnInit {
  deals: any[] = [];
  isLoading: boolean = true;
  apiErrors: any = null;

  private dealsApiUrl = 'https://localhost:7152/api/deal/';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchAllDeals();
  }

  fetchAllDeals(): void {
    this.isLoading = true;
    this.apiErrors = null;
    console.log('Fetching all deals...');

    this.http.get<any[]>(this.dealsApiUrl).subscribe({
      next: (data: any[]) => {
        console.log('API Response Data:', data);
        if (Array.isArray(data)) {
          this.deals = data;
          console.log('Deals array populated:', this.deals);
        } else {
          this.apiErrors = {
            general:
              'Unexpected API response format. Expected an array of deals.',
          };
          console.error('API Error: Response is not an array.', data);
        }
        this.isLoading = false;
        console.log('isLoading set to false. Deals count:', this.deals.length);
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching deals:', error);
        this.apiErrors = {
          general: `Failed to fetch deals: ${
            error.message || 'Unknown error'
          }. Status: ${error.status}`,
        };
        this.isLoading = false;
        console.log('isLoading set to false due to error.');
        this.cdr.detectChanges();
      },
    });
  }
}
