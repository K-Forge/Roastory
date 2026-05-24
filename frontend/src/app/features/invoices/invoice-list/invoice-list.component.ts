import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceService } from '../../../core/services/invoice.service';
import { AuthService } from '../../../core/services/auth.service';
import { Invoice, InvoiceStatus, PaymentMethod } from '../../../shared/models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  invoices = signal<Invoice[]>([]);
  loading = signal(false);

  readonly isAdmin = computed(() => this.authService.currentRole() === 'ADMIN');

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading.set(true);
    const invoices$ = this.isAdmin()
      ? this.invoiceService.getAll()
      : this.invoiceService.getMine();

    invoices$.subscribe({
      next: invoices => {
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las facturas.' });
        this.loading.set(false);
      }
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/invoices', id]);
  }

  downloadPdf(invoice: Invoice): void {
    this.invoiceService.downloadPdf(invoice._id, invoice.invoiceNumber).subscribe({
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el PDF.' })
    });
  }

  confirmVoid(invoice: Invoice): void {
    this.confirmationService.confirm({
      message: `¿Anular la factura ${invoice.invoiceNumber}? Esta acción no se puede deshacer.`,
      header: 'Confirmar anulación',
      icon: 'pi pi-ban',
      acceptLabel: 'Anular',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.voidInvoice(invoice._id)
    });
  }

  private voidInvoice(id: string): void {
    this.invoiceService.voidInvoice(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Factura anulada.' });
        this.loadInvoices();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo anular la factura.' });
      }
    });
  }

  getStatusSeverity(status: InvoiceStatus): 'info' | 'success' | 'danger' | 'secondary' {
    const map: Record<InvoiceStatus, 'info' | 'success' | 'danger' | 'secondary'> = {
      ISSUED: 'info', PAID: 'success', VOIDED: 'danger'
    };
    return map[status];
  }

  getStatusLabel(status: InvoiceStatus): string {
    const map: Record<InvoiceStatus, string> = {
      ISSUED: 'Emitida', PAID: 'Pagada', VOIDED: 'Anulada'
    };
    return map[status];
  }

  getPaymentLabel(method: PaymentMethod): string {
    const map: Record<PaymentMethod, string> = {
      CASH: 'Efectivo', CREDIT_CARD: 'Tarjeta crédito',
      DEBIT_CARD: 'Tarjeta débito', TRANSFER: 'Transferencia'
    };
    return map[method];
  }
}
