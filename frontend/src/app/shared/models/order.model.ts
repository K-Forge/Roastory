import { PaymentMethod } from './invoice.model';

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  product: { _id: string; name: string; price: number };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customer: { _id: string; name: string; email: string };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  customer: string;
  items: { product: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
}
