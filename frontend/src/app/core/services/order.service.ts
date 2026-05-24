import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Order, CreateOrderDto, UpdateOrderDto } from '../../shared/models/order.model';

const API_URL = 'http://localhost:3000/api/orders';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  getAll() {
    return this.http
      .get<{ count: number; orders: Order[] }>(API_URL)
      .pipe(map(res => res.orders));
  }

  getById(id: string) {
    return this.http
      .get<{ order: Order }>(`${API_URL}/${id}`)
      .pipe(map(res => res.order));
  }

  create(dto: CreateOrderDto) {
    return this.http
      .post<{ order: Order }>(API_URL, dto)
      .pipe(map(res => res.order));
  }

  update(id: string, dto: UpdateOrderDto) {
    return this.http
      .put<{ order: Order }>(`${API_URL}/${id}`, dto)
      .pipe(map(res => res.order));
  }

  remove(id: string) {
    return this.http.delete<{ message: string }>(`${API_URL}/${id}`);
  }
}
