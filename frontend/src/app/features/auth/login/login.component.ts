import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.value;

    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {
        this.errorMessage.set('Correo o contraseña incorrectos.');
        this.loading.set(false);
      }
    });
  }
}
