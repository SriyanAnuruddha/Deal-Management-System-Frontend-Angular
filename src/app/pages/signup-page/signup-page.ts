import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup-service';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss',
})
export class SignupPage {
  constructor(private router: Router) {}

  signupForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  signupService = inject(SignupService);

  onSubmitHandler() {
    const username = this.signupForm.value.username!;
    const password = this.signupForm.value.password!;

    this.signupService.login(username, password).subscribe({
      next: (res) => {
        alert('Signup successful');
        this.signupForm.reset();
        localStorage.setItem('authUser', JSON.stringify(res));

        this.router.navigate(['/view-deals']);
      },
      error: (err) => {
        alert('username already exists!');
      },
    });
  }
}
