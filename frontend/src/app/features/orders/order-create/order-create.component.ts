import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../shared/models/product.model';
import { PaymentMethod } from '../../../shared/models/invoice.model';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    CardModule,
    DividerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.css'
})
export class OrderCreateComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  cartItems = signal<CartItem[]>([]);
  searchText = signal('');
  selectedPaymentMethod = signal<PaymentMethod>('CASH');
  loading = signal(false);
  submitting = signal(false);

  paymentOptions = [
    { label: 'Efectivo', value: 'CASH' },
    { label: 'Tarjeta crédito', value: 'CREDIT_CARD' },
    { label: 'Tarjeta débito', value: 'DEBIT_CARD' },
    { label: 'Transferencia', value: 'TRANSFER' }
  ];

  readonly filteredProducts = computed(() => {
    const search = this.searchText().toLowerCase();
    const active = this.products().filter(p => p.isActive);
    if (!search) return active;
    return active.filter(p => p.name.toLowerCase().includes(search));
  });

  readonly total = computed(() =>
    this.cartItems().reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0)
  );

  ngOnInit(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: products => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(product: Product): void {
    const current = this.cartItems();
    const existing = current.find(ci => ci.product._id === product._id);
    if (existing) {
      this.cartItems.set(
        current.map(ci =>
          ci.product._id === product._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      );
    } else {
      this.cartItems.set([...current, { product, quantity: 1 }]);
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.set(
      this.cartItems().map(ci =>
        ci.product._id === productId ? { ...ci, quantity } : ci
      )
    );
  }

  removeFromCart(productId: string): void {
    this.cartItems.set(this.cartItems().filter(ci => ci.product._id !== productId));
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  submit(): void {
    if (this.cartItems().length === 0) return;

    const userId = this.authService.currentUserId();
    if (!userId) return;

    this.submitting.set(true);

    this.orderService.create({
      customer: userId,
      items: this.cartItems().map(ci => ({
        product: ci.product._id,
        quantity: ci.quantity,
        price: ci.product.price
      })),
      totalAmount: this.total(),
      paymentMethod: this.selectedPaymentMethod()
    }).subscribe({
      next: order => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Orden creada correctamente.' });
        setTimeout(() => this.router.navigate(['/orders', order._id]), 1000);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la orden.' });
        this.submitting.set(false);
      }
    });
  }
}
