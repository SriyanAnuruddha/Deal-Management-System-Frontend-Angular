import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../components/hotel/hotel';

interface DealDetails {
  id: string;
  name: string;
  hotels: HotelInterface[];
}

interface HotelInterface {
  id: string;
  name: string;
  rate: number;
  amenities: string;
}

@Component({
  selector: 'app-view-deal-page',
  standalone: true,
  imports: [Navbar, CommonModule, Hotel],
  templateUrl: './view-deal-page.html',
  styleUrl: './view-deal-page.scss',
})
export class ViewDealPage implements OnInit, OnDestroy {
  dealId: string | null = null;
  dealSlug: string | null = null;
  dealDetails: DealDetails | null = null;
  videoUrl: string | null = null;
  isLoading: boolean = true;
  apiErrors: any = null;

  private dealApiBaseUrl = 'https://localhost:7152/api/deal';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.dealId = params.get('id');
      this.dealSlug = params.get('slug');

      if (this.dealSlug) {
        this.fetchDealDetailsBySlug(this.dealSlug);
      } else {
        this.apiErrors = {
          general: 'Deal slug not provided in URL for details.',
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      }

      if (this.dealId) {
        this.fetchDealVideoById(this.dealId);
      } else {
        console.warn(
          'Deal ID not provided in URL for video. Video might not load.'
        );
      }

      if (!this.dealId && !this.dealSlug) {
        this.apiErrors = {
          general: 'Neither Deal ID nor Slug provided in URL.',
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchDealDetailsBySlug(slug: string): void {
    this.isLoading = true;
    this.apiErrors = null;
    this.dealDetails = null;

    this.http.get<DealDetails>(`${this.dealApiBaseUrl}/${slug}`).subscribe({
      next: (data: DealDetails) => {
        this.dealDetails = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.apiErrors = {
          general: `Failed to load deal details: ${
            error.message || 'Unknown error'
          }. Status: ${error.status}`,
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  fetchDealVideoById(id: string): void {
    this.videoUrl = null;

    this.http
      .get(`${this.dealApiBaseUrl}/${id}/video`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (videoBlob: Blob) => {
          if (videoBlob.type.startsWith('video/')) {
            this.videoUrl = URL.createObjectURL(videoBlob);
          } else {
            console.warn(
              'Received non-video blob for video endpoint:',
              videoBlob
            );
          }
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching video:', error);
          if (error.status === 404) {
            console.log('No video found for this deal (404).');

            this.videoUrl = null;
          } else {
            this.apiErrors = {
              general: `Failed to load video: ${
                error.message || 'Unknown error'
              }. Status: ${error.status}`,
            };
          }
          this.cdr.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
    }
  }
}
