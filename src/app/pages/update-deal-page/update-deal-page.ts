import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-deal-page',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './update-deal-page.html',
  styleUrl: './update-deal-page.scss',
})
export class UpdateDealPage implements OnInit {
  dealId: string | null = null;
  dealName: string = '';
  selectedFile: File | null = null;
  apiErrors: any = null;

  private dealsApiUrl = 'https://localhost:7152/api/deal';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.dealId = params.get('id');
      const nameFromUrl = params.get('name');
      if (nameFromUrl) {
        this.dealName = nameFromUrl;
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null;
    }
  }

  onUpdateDetails(): void {
    this.apiErrors = null;

    if (!this.dealId) {
      this.apiErrors = { general: 'Deal ID not found for update.' };
      return;
    }

    if (!this.dealName.trim()) {
      alert('Deal name cannot be empty.');
      return;
    }

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

    if (this.selectedFile) {
      formData.append('videoFile', this.selectedFile, this.selectedFile.name);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });

    this.http
      .put(`${this.dealsApiUrl}/${this.dealId}`, formData, {
        headers,
        responseType: 'text' as 'json',
      })
      .subscribe({
        next: (response: any) => {
          alert('Deal updated successfully!');
          this.router.navigate(['/manage-deals']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.apiErrors = {
              general: 'Unauthorized: Please log in again to update deals.',
            };
          } else if (error.status === 403) {
            this.apiErrors = {
              general: 'Forbidden: You do not have permission to update deals.',
            };
          } else if (error.status === 404) {
            this.apiErrors = {
              general: 'Deal not found. It might have been deleted.',
            };
          } else {
            this.apiErrors = {
              general: `Failed to update deal: ${
                error.message || 'Unknown error'
              }. Status: ${error.status}`,
            };
          }
          alert(
            `Failed to update deal. Error: ${
              this.apiErrors.general || error.message || 'Unknown error'
            }`
          );
        },
      });
  }
}
