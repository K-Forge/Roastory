import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice, InvoiceStatus, PaymentMethod } from '../../../shared/models/invoice.model';

@Component({
  selector: 'app-invoice-detail',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    DividerModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.css'
})
export class InvoiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invoiceService = inject(InvoiceService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  invoice = signal<Invoice | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.invoiceService.getById(id).subscribe({
      next: invoice => {
        this.invoice.set(invoice);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la factura.' });
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/invoices']);
  }

  downloadPdf(): void {
    const inv = this.invoice();
    if (!inv) return;
    this.invoiceService.downloadPdf(inv._id, inv.invoiceNumber).subscribe({
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el PDF.' })
    });
  }

  confirmVoid(): void {
    const inv = this.invoice();
    if (!inv) return;
    this.confirmationService.confirm({
      message: `¿Anular la factura ${inv.invoiceNumber}? Esta acción no se puede deshacer.`,
      header: 'Confirmar anulación',
      icon: 'pi pi-ban',
      acceptLabel: 'Anular',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.invoiceService.voidInvoice(inv._id).subscribe({
          next: updated => {
            this.invoice.set(updated);
            this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Factura anulada.' });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo anular la factura.' })
        });
      }
    });
  }

  getStatusSeverity(status: InvoiceStatus): 'info' | 'success' | 'danger' {
    const map: Record<InvoiceStatus, 'info' | 'success' | 'danger'> = {
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
