import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProductService } from '../../core/services/product.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, ProgressSpinnerModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private invoiceService = inject(InvoiceService);
  private authService = inject(AuthService);

  readonly isAdmin = computed(() => this.authService.currentRole() === 'ADMIN');

  loading = signal(true);
  totalProducts = signal(0);
  activeProducts = signal(0);
  lowStockProducts = signal(0);
  totalInvoices = signal(0);
  totalRevenue = signal(0);

  ngOnInit(): void {
    const invoices$ = this.isAdmin()
      ? this.invoiceService.getAll().pipe(catchError(() => of([])))
      : of([]);

    forkJoin({
      products: this.productService.getAll().pipe(catchError(() => of([]))),
      invoices: invoices$
    }).subscribe({
      next: ({ products, invoices }) => {
        this.totalProducts.set(products.length);
        this.activeProducts.set(products.filter(p => p.isActive).length);
        this.lowStockProducts.set(products.filter(p => p.stock < 5).length);
        this.totalInvoices.set(invoices.length);
        this.totalRevenue.set(invoices.reduce((sum, inv) => sum + inv.total, 0));
        this.loading.set(false);
      }
    });
  }
}
