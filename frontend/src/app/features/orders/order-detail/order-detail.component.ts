import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderService } from '../../../core/services/order.service';
import { InvoiceService } from '../../../core/services/invoice.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order, OrderStatus } from '../../../shared/models/order.model';
import { PaymentMethod } from '../../../shared/models/invoice.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    DividerModule,
    SelectModule,
    DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private invoiceService = inject(InvoiceService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private auth = inject(AuthService);

  order = signal<Order | null>(null);
  loading = signal(true);
  showStatusDialog = signal(false);
  selectedStatus = signal<OrderStatus>('PENDING');
  updatingStatus = signal(false);
  generatingInvoice = signal(false);

  readonly isAdminOrCashier = computed(() => {
    const role = this.auth.currentRole();
    return role === 'ADMIN' || role === 'CASHIER';
  });

  statusOptions = [
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Completado', value: 'COMPLETED' },
    { label: 'Cancelado', value: 'CANCELLED' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getById(id).subscribe({
      next: order => {
        this.order.set(order);
        this.selectedStatus.set(order.status);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la orden.' });
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  openStatusDialog(): void {
    this.showStatusDialog.set(true);
  }

  saveStatus(): void {
    const ord = this.order();
    if (!ord) return;
    this.updatingStatus.set(true);
    this.orderService.update(ord._id, { status: this.selectedStatus() }).subscribe({
      next: updated => {
        this.order.set(updated);
        this.showStatusDialog.set(false);
        this.updatingStatus.set(false);
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Estado actualizado.' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado.' });
        this.updatingStatus.set(false);
      }
    });
  }

  generateInvoice(): void {
    const ord = this.order();
    if (!ord) return;
    this.confirmationService.confirm({
      message: '¿Generar factura para esta orden?',
      header: 'Generar factura',
      icon: 'pi pi-receipt',
      acceptLabel: 'Generar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.generatingInvoice.set(true);
        this.invoiceService.create({ orderId: ord._id }).subscribe({
          next: invoice => {
            this.messageService.add({ severity: 'success', summary: 'Listo', detail: `Factura ${invoice.invoiceNumber} generada.` });
            setTimeout(() => this.router.navigate(['/invoices', invoice._id]), 1200);
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo generar la factura.' });
            this.generatingInvoice.set(false);
          }
        });
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
