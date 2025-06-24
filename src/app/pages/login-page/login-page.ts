import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  constructor(private router: Router) {}

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  loginService = inject(LoginService);

  onSubmitHandler() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      alert('Please enter both username and password.');
      return;
    }

    const username = this.loginForm.value.username!;
    const password = this.loginForm.value.password!;

    this.loginService.login(username, password).subscribe({
      next: (res) => {
        alert('Login successful');
        this.loginForm.reset();
        localStorage.setItem('authUser', JSON.stringify(res));

        if (res.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (res.role === 'customer') {
          this.router.navigate(['/view-deals']);
        }
      },
      error: (err) => {
        alert('username or password is wrong!');
        console.error('Login failed:', err);
      },
    });
  }
}
