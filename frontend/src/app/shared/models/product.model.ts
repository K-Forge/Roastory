export type ProductCategory = 'COFFEE' | 'BOOK' | 'PASTRY' | 'OTHER';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  stock: number;
  sku?: string;
  author?: string;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateDto {
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  stock: number;
  sku?: string;
  author?: string;
}

export interface ProductUpdateDto extends Partial<ProductCreateDto> {}

export interface StockAdjustDto {
  adjustment: number;
}
