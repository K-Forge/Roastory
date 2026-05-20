export type UserRole = 'ADMIN' | 'INVENTORY_MANAGER' | 'CASHIER' | 'CUSTOMER';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface TokenPayload {
  id: string;
  role: UserRole;
  name?: string;
  iat: number;
  exp: number;
}
