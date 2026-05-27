import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginDto, LoginResponse, TokenPayload, UserRole } from '../../shared/models/user.model';

const API_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'roastory_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly isLoggedIn = computed(() => !!this._token());
  readonly currentRole = computed(() => this.getPayload()?.role ?? null);
  readonly currentUserName = computed(() => this.getPayload()?.name ?? null);
  readonly currentUserId = computed(() => this.getPayload()?.id ?? null);

  register(data: { name: string; email: string; password: string }) {
    return this.http.post<{ userId: string }>(`${API_URL}/auth/register`, data);
  }

  login(credentials: LoginDto) {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, credentials).pipe(
      tap(({ token }) => {
        localStorage.setItem(TOKEN_KEY, token);
        this._token.set(token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  getRole(): UserRole | null {
    return this.currentRole();
  }

  private getPayload(): TokenPayload | null {
    const token = this._token();
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64)) as TokenPayload;
    } catch {
      return null;
    }
  }
}
