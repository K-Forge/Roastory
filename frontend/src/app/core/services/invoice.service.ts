import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Invoice, CreateInvoiceDto } from '../../shared/models/invoice.model';

const API_URL = 'http://localhost:3000/api/invoices';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private http = inject(HttpClient);

  getAll() {
    return this.http
      .get<{ count: number; invoices: Invoice[] }>(API_URL)
      .pipe(map(res => res.invoices));
  }

  getMine() {
    return this.http
      .get<{ count: number; invoices: Invoice[] }>(`${API_URL}/me`)
      .pipe(map(res => res.invoices));
  }

  getById(id: string) {
    return this.http
      .get<{ invoice: Invoice }>(`${API_URL}/${id}`)
      .pipe(map(res => res.invoice));
  }

  create(dto: CreateInvoiceDto) {
    return this.http
      .post<{ invoice: Invoice }>(API_URL, dto)
      .pipe(map(res => res.invoice));
  }

  voidInvoice(id: string) {
    return this.http
      .patch<{ invoice: Invoice }>(`${API_URL}/${id}/void`, {})
      .pipe(map(res => res.invoice));
  }

  downloadPdf(id: string, invoiceNumber: string) {
    return this.http
      .get(`${API_URL}/${id}/pdf`, { responseType: 'blob' })
      .pipe(
        map(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `factura-${invoiceNumber}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        })
      );
  }
}
