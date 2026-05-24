import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order, OrderStatus } from '../../../shared/models/order.model';
import { PaymentMethod } from '../../../shared/models/invoice.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private auth = inject(AuthService);

  orders = signal<Order[]>([]);
  loading = signal(false);
  selectedStatus = signal<string>('ALL');

  readonly isAdmin = computed(() => this.auth.currentRole() === 'ADMIN');

  statusOptions = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Completado', value: 'COMPLETED' },
    { label: 'Cancelado', value: 'CANCELLED' }
  ];

  get filteredOrders(): Order[] {
    const status = this.selectedStatus();
    if (status === 'ALL') return this.orders();
    return this.orders().filter(o => o.status === status);
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getAll().subscribe({
      next: orders => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las órdenes.' });
        this.loading.set(false);
      }
    });
  }

  goToNew(): void {
    this.router.navigate(['/orders/new']);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/orders', id]);
  }

  confirmDelete(order: Order): void {
    this.confirmationService.confirm({
      message: `¿Eliminar la orden #${order._id.slice(-6).toUpperCase()}? Esta acción no se puede deshacer.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteOrder(order._id)
    });
  }

  private deleteOrder(id: string): void {
    this.orderService.remove(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Orden eliminada.' });
        this.loadOrders();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la orden.' });
      }
    });
  }

  getStatusSeverity(s: OrderStatus): 'warn' | 'success' | 'danger' {
    const map: Record<OrderStatus, 'warn' | 'success' | 'danger'> = {
      PENDING: 'warn', COMPLETED: 'success', CANCELLED: 'danger'
    };
    return map[s];
  }

  getStatusLabel(s: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      PENDING: 'Pendiente', COMPLETED: 'Completado', CANCELLED: 'Cancelado'
    };
    return map[s];
  }

  getPaymentLabel(m: PaymentMethod): string {
    const map: Record<PaymentMethod, string> = {
      CASH: 'Efectivo', CREDIT_CARD: 'Tarjeta crédito',
      DEBIT_CARD: 'Tarjeta débito', TRANSFER: 'Transferencia'
    };
    return map[m];
  }
}
