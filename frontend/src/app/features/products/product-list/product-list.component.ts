import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, ProductCategory } from '../../../shared/models/product.model';
import { ProductFormComponent } from '../product-form/product-form.component';

interface CategoryOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ProductFormComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  readonly canManage = computed(() => {
    const role = this.authService.currentRole();
    return role === 'ADMIN' || role === 'INVENTORY_MANAGER';
  });

  products = signal<Product[]>([]);
  loading = signal(false);
  searchText = signal('');
  selectedCategory = signal('ALL');
  showFormDialog = signal(false);
  selectedProduct = signal<Product | null>(null);

  categoryOptions: CategoryOption[] = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Café', value: 'COFFEE' },
    { label: 'Libro', value: 'BOOK' },
    { label: 'Repostería', value: 'PASTRY' },
    { label: 'Otro', value: 'OTHER' }
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll(this.selectedCategory()).subscribe({
      next: products => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos.' });
        this.loading.set(false);
      }
    });
  }

  get filteredProducts(): Product[] {
    const search = this.searchText().toLowerCase();
    if (!search) return this.products();
    return this.products().filter(p => p.name.toLowerCase().includes(search));
  }

  onCategoryChange(): void {
    this.loadProducts();
  }

  openNew(): void {
    this.selectedProduct.set(null);
    this.showFormDialog.set(true);
  }

  openEdit(product: Product): void {
    this.selectedProduct.set(product);
    this.showFormDialog.set(true);
  }

  confirmDelete(product: Product): void {
    this.confirmationService.confirm({
      message: `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteProduct(product._id)
    });
  }

  private deleteProduct(id: string): void {
    this.productService.remove(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Producto eliminado.' });
        this.loadProducts();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto.' });
      }
    });
  }

  onFormSaved(): void {
    this.showFormDialog.set(false);
    this.loadProducts();
    this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Producto guardado correctamente.' });
  }

  onFormCancelled(): void {
    this.showFormDialog.set(false);
  }

  getCategoryLabel(category: ProductCategory): string {
    const map: Record<ProductCategory, string> = {
      COFFEE: 'Café', BOOK: 'Libro', PASTRY: 'Repostería', OTHER: 'Otro'
    };
    return map[category];
  }

  getCategorySeverity(category: ProductCategory): 'info' | 'success' | 'warn' | 'secondary' {
    const map: Record<ProductCategory, 'info' | 'success' | 'warn' | 'secondary'> = {
      COFFEE: 'warn', BOOK: 'info', PASTRY: 'success', OTHER: 'secondary'
    };
    return map[category];
  }
}
