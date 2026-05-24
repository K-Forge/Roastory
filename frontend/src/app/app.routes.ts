import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./features/invoices/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'invoices/:id',
    loadComponent: () =>
      import('./features/invoices/invoice-detail/invoice-detail.component').then(m => m.InvoiceDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
