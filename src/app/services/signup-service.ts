import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  http = inject(HttpClient);

  login(username?: string, password?: string): Observable<any> {
    return this.http.post('https://localhost:7152/api/auth/register', {
      username,
      password,
    });
  }
}
