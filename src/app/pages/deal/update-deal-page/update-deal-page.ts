import { Component, OnInit, ViewChild } from '@angular/core';
import { Navbar } from '../../../components/navbar/navbar';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-update-deal-page',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-deal-page.html',
  styleUrl: './update-deal-page.scss',
})
export class UpdateDealPage implements OnInit {
  updateDealForm!: FormGroup;

  dealId: string | null = null;
  dealName: string = '';
  selectedFile: File | null = null;
  apiErrors: any = null;

  private dealsApiUrl = 'https://localhost:7152/api/deal';

  @ViewChild('dealForm') ngForm!: NgForm;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.updateDealForm = this.fb.group({
      dealNameControl: ['', Validators.required],
      videoFileControl: [null],
    });

    this.route.paramMap.subscribe((params) => {
      this.dealId = params.get('id');
      const nameFromUrl = params.get('name');
      if (nameFromUrl) {
        this.dealName = nameFromUrl;
        this.updateDealForm.get('dealNameControl')?.patchValue(nameFromUrl);
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      this.updateDealForm
        .get('videoFileControl')
        ?.patchValue(this.selectedFile);
      this.updateDealForm.get('videoFileControl')?.updateValueAndValidity();
    } else {
      this.selectedFile = null;
      this.updateDealForm.get('videoFileControl')?.patchValue(null);
      this.updateDealForm.get('videoFileControl')?.updateValueAndValidity();
    }
  }

  onUpdateDetails(): void {
    this.apiErrors = null;

    if (!this.dealId) {
      this.apiErrors = { general: 'Deal ID not found for update.' };
      return;
    }

    this.updateDealForm.get('dealNameControl')?.patchValue(this.dealName);
    this.updateDealForm.get('dealNameControl')?.updateValueAndValidity();

    this.updateDealForm.markAllAsTouched();
    if (this.ngForm) {
      this.ngForm.form.markAllAsTouched();
    }

    if (this.updateDealForm.invalid) {
      if (this.updateDealForm.get('dealNameControl')?.errors?.['required']) {
        this.apiErrors = {
          ...(this.apiErrors || {}),
          Name: ['Deal name cannot be empty.'],
        };
      }
      alert('Please correct the validation errors before submitting.');
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
          if (error.status === 400 && error.error) {
            try {
              const backendErrors = JSON.parse(error.error).errors;
              if (backendErrors.Name) {
                this.apiErrors = {
                  ...(this.apiErrors || {}),
                  Name: backendErrors.Name[0],
                };
                if (this.ngForm && this.ngForm.controls['name']) {
                  this.ngForm.controls['name'].setErrors({
                    backend: backendErrors.Name[0],
                  });
                }
              }
              if (backendErrors.VideoFile) {
                this.apiErrors = {
                  ...(this.apiErrors || {}),
                  VideoFile: backendErrors.VideoFile[0],
                };
              }
            } catch (e) {
              this.apiErrors = {
                general:
                  error.error.message ||
                  `Failed to update deal: ${error.statusText}`,
              };
            }
          } else if (error.status === 401) {
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
