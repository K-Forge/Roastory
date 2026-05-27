import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../shared/models/product.model';

interface CategoryOption { label: string; value: ProductCategory; }

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  product = input<Product | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  loading = false;

  categoryOptions: CategoryOption[] = [
    { label: 'Café', value: 'COFFEE' },
    { label: 'Libro', value: 'BOOK' },
    { label: 'Repostería', value: 'PASTRY' },
    { label: 'Otro', value: 'OTHER' }
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    category: [null as ProductCategory | null, Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sku: [''],
    author: ['']
  });

  get isBook(): boolean {
    return this.form.value.category === 'BOOK';
  }

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.form.patchValue({
          name: p.name,
          description: p.description ?? '',
          category: p.category,
          price: p.price,
          stock: p.stock,
          sku: p.sku ?? '',
          author: p.author ?? ''
        });
      } else {
        this.form.reset({ price: 0, stock: 0 });
      }
    });
  }

  ngOnInit(): void {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const { name, description, category, price, stock, sku, author } = this.form.value;
    const dto = {
      name: name!,
      description: description ?? undefined,
      category: category!,
      price: price!,
      stock: stock!,
      sku: sku ?? undefined,
      author: author ?? undefined
    };

    const request = this.product()
      ? this.productService.update(this.product()!._id, dto)
      : this.productService.create(dto);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
