export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER';
export type InvoiceStatus = 'ISSUED' | 'PAID' | 'VOIDED';

export interface InvoiceItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  order: string;
  customer: { _id: string; name: string; email: string };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  orderId: string;
}
