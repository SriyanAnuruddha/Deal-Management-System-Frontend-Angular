import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);

  login(username?: string, password?: string): Observable<any> {
    return this.http.post('https://localhost:7152/api/auth/login', {
      username,
      password,
    });
  }
}
