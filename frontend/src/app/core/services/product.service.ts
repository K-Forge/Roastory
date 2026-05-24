import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Product, ProductCreateDto, ProductUpdateDto, StockAdjustDto } from '../../shared/models/product.model';

const API_URL = 'http://localhost:3000/api/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getAll(category?: string) {
    let params = new HttpParams();
    if (category && category !== 'ALL') {
      params = params.set('category', category);
    }
    return this.http
      .get<{ count: number; products: Product[] }>(API_URL, { params })
      .pipe(map(res => res.products));
  }

  getById(id: string) {
    return this.http
      .get<{ product: Product }>(`${API_URL}/${id}`)
      .pipe(map(res => res.product));
  }

  create(dto: ProductCreateDto) {
    return this.http
      .post<{ product: Product }>(API_URL, dto)
      .pipe(map(res => res.product));
  }

  update(id: string, dto: ProductUpdateDto) {
    return this.http
      .put<{ product: Product }>(`${API_URL}/${id}`, dto)
      .pipe(map(res => res.product));
  }

  remove(id: string) {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  adjustStock(id: string, dto: StockAdjustDto) {
    return this.http
      .patch<{ product: Product }>(`${API_URL}/${id}/stock`, dto)
      .pipe(map(res => res.product));
  }
}
