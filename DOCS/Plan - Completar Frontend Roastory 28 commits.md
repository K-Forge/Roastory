## Context

Roastory es un sistema de gestión para una biblioteca-cafetería desarrollado por K-Forge (Lina Bello, Brian Vargas, Sebastián Angulo) para la asignatura NTD de Konrad Lorenz. El backend está completo (Node.js + Express + MongoDB). Sebastián ya realizó 2 commits con el esqueleto del frontend en Angular 21 + PrimeNG 21.

El objetivo es completar el frontend funcional con todos los módulos del sistema: POS/Órdenes, Dashboard, Admin de usuarios, Register, y mejoras de UX.

---

## Estado actual del frontend (commits de Sebastián)

### Lo que ya existe
- Configuración Angular 21 + PrimeNG 21 + PrimeFlex + standalone components
- `app.routes.ts`: rutas `/login`, `/products`, `/invoices`, `/invoices/:id`
- `core/services/`: `auth.service.ts`, `product.service.ts`, `invoice.service.ts`
- `core/guards/auth.guard.ts` + `core/interceptors/auth.interceptor.ts`
- `features/auth/login/`: componente completo con reactive form + PrimeNG
- `features/products/product-list/` + `product-form/`: CRUD completo con filtros y diálogo modal
- `features/invoices/invoice-list/` + `invoice-detail/`: tabla + vista detallada con descarga PDF
- `shared/models/`: `user.model.ts`, `product.model.ts`, `invoice.model.ts`
- `app.ts/html/css`: navbar con login/logout, router-outlet

### Lo que falta
| Módulo | Estado |
|--------|--------|
| **Órdenes / POS** | No existe — ni modelo, ni servicio, ni componentes |
| **Dashboard** | No existe — no hay página de inicio post-login |
| **Admin (usuarios)** | No existe — sin user.service ni componentes |
| **Register** | No existe — sólo hay login |
| **Role Guard** | No existe — sólo `auth.guard` (presencia de token) |
| **Componentes compartidos** | Sin loading-spinner, empty-state, page-header reutilizables |
| **Páginas de error** | Sin 404 ni 403 |
| **Interceptor de errores HTTP** | Sin captura global de errores 401/403/500 |
| **Mejoras UX productos** | Sin ajuste de stock inline, sin vista grid/cards |
| **Mejoras UX facturas** | Sin filtros por estado/fecha, sin preview PDF |

---

## Arquitectura de lo nuevo

```
src/app/
├── core/
│   ├── services/
│   │   ├── order.service.ts          ← NUEVO (Brian)
│   │   ├── user.service.ts           ← NUEVO (Lina)
│   │   └── stats.service.ts          ← NUEVO (Lina)
│   ├── guards/
│   │   └── role.guard.ts             ← NUEVO (Lina)
│   └── interceptors/
│       └── error.interceptor.ts      ← NUEVO (Sebastián)
│
├── features/
│   ├── auth/
│   │   └── register/                 ← NUEVO (Lina)
│   ├── dashboard/                    ← NUEVO (Lina)
│   ├── orders/                       ← NUEVO (Brian)
│   │   ├── order-list/
│   │   ├── order-detail/
│   │   └── order-create/
│   │       └── cart/
│   └── admin/                        ← NUEVO (Lina)
│       ├── admin-layout/
│       └── user-list/
│
├── shared/
│   ├── models/
│   │   └── order.model.ts            ← NUEVO (Brian)
│   └── components/                   ← NUEVO (Lina)
│       ├── loading-spinner/
│       ├── empty-state/
│       └── page-header/
│
└── features/errors/                  ← NUEVO (Lina)
    ├── not-found/
    └── unauthorized/
```

**Convenciones a respetar:**
- Standalone components (no NgModules)
- Angular Signals para estado reactivo
- Functional guards e interceptors
- PrimeNG para todos los componentes UI
- Mensajes de commit en inglés: `type: short message`
- Variables, clases, comentarios en inglés

---

## Plan de 28 commits

---

### SEBASTIÁN ANGULO — 8 commits

**Commit S-1**
- **Objetivo:** Ajuste de stock inline en product-list sin abrir el formulario completo
- **Componentes:** Dialog de ajuste de stock en `ProductListComponent`
- **Archivos:** `features/products/product-list/product-list.component.{ts,html,css}`, reutiliza `product.service.ts::adjustStock()`
- **Commit:** `feat: add inline stock adjustment dialog in product list`

**Commit S-2**
- **Objetivo:** Vista alternativa de productos en tarjetas (grid) con toggle tabla/cards
- **Componentes:** `ProductCardComponent` + toggle button en `ProductListComponent`
- **Archivos:** `features/products/product-card/product-card.component.{ts,html,css}`, `features/products/product-list/product-list.component.*`
- **Commit:** `feat: implement product card grid view toggle in catalog`

**Commit S-3**
- **Objetivo:** Interceptor global que capture errores HTTP (401→login, 403→unauthorized, 500→toast)
- **Componentes:** `ErrorInterceptor` funcional
- **Archivos:** `core/interceptors/error.interceptor.ts`, `app.config.ts`
- **Commit:** `feat: add global HTTP error interceptor with toast and redirect handling`

**Commit S-4**
- **Objetivo:** Visibilidad de items del navbar y botones de acción según rol del usuario
- **Componentes:** Helper de roles en `AuthService`, actualizar `app.html`
- **Archivos:** `core/services/auth.service.ts`, `app.html`, `app.css`
- **Commit:** `feat: apply role-based visibility to navbar links and action buttons`

**Commit S-5**
- **Objetivo:** Filtros de facturas por estado (ISSUED/PAID/VOIDED) y por rango de fechas
- **Componentes:** Filter bar en `InvoiceListComponent`
- **Archivos:** `features/invoices/invoice-list/invoice-list.component.{ts,html,css}`
- **Commit:** `feat: add status and date range filters to invoice list`

**Commit S-6**
- **Objetivo:** Modal de previsualización del PDF de factura usando iframe antes de descargar
- **Componentes:** Dialog de preview en `InvoiceDetailComponent`
- **Archivos:** `features/invoices/invoice-detail/invoice-detail.component.{ts,html,css}`
- **Commit:** `feat: add PDF preview iframe modal in invoice detail`

**Commit S-7**
- **Objetivo:** Modal de detalle del producto (read-only) accesible desde la tabla
- **Componentes:** Dialog de detalle en `ProductListComponent`
- **Archivos:** `features/products/product-list/product-list.component.{ts,html,css}`
- **Commit:** `feat: add read-only product detail modal in product catalog`

**Commit S-8**
- **Objetivo:** Panel de alertas de stock bajo en el dashboard (depende de commit L-1 de Lina)
- **Componentes:** Sección low-stock en `DashboardComponent`, usa `product.service.ts::getAll()`
- **Archivos:** `features/dashboard/dashboard.component.{ts,html,css}`
- **Commit:** `feat: add low-stock product alert panel to dashboard`

---

### LINA BELLO — 10 commits

**Commit L-1**
- **Objetivo:** Página de inicio post-login con tarjetas KPI (ventas, productos activos, facturas, órdenes)
- **Componentes:** `DashboardComponent` con PrimeNG Cards + redirect desde `/` si autenticado
- **Archivos:** `features/dashboard/dashboard.component.{ts,html,css}`, `app.routes.ts`
- **Commit:** `feat: create dashboard layout with PrimeNG KPI stat cards`

**Commit L-2**
- **Objetivo:** Servicio que agregue datos de products, orders e invoices para poblar el dashboard
- **Componentes:** `StatsService` con métodos observables; conectar al dashboard
- **Archivos:** `core/services/stats.service.ts`, `features/dashboard/dashboard.component.ts`
- **Commit:** `feat: implement stats service for dashboard data aggregation`

**Commit L-3**
- **Objetivo:** Formulario de registro de usuario público, accesible desde la pantalla de login
- **Componentes:** `RegisterComponent` con reactive form + validaciones; añadir `register()` a `AuthService`
- **Archivos:** `features/auth/register/register.component.{ts,html,css}`, `core/services/auth.service.ts`, `app.routes.ts`
- **Commit:** `feat: add register component with reactive form and route`

**Commit L-4**
- **Objetivo:** Guard que verifique el rol del usuario (ADMIN) antes de activar rutas del panel admin
- **Componentes:** `roleGuard` (functional guard), acepta roles permitidos como parámetro
- **Archivos:** `core/guards/role.guard.ts`, `app.routes.ts`
- **Commit:** `feat: create role guard for admin-only route protection`

**Commit L-5**
- **Objetivo:** Layout del panel admin con sidebar PrimeNG y navegación a secciones admin
- **Componentes:** `AdminLayoutComponent` con `p-sidebar` o `p-menu` lateral
- **Archivos:** `features/admin/admin-layout/admin-layout.component.{ts,html,css}`, `app.routes.ts`
- **Commit:** `feat: build admin layout with PrimeNG sidebar navigation`

**Commit L-6**
- **Objetivo:** Tabla de usuarios con badge de rol, estado activo/inactivo y botones de acción
- **Componentes:** `UserListComponent` + `UserService`
- **Archivos:** `features/admin/user-list/user-list.component.{ts,html,css}`, `core/services/user.service.ts`
- **Commit:** `feat: implement admin user list with role badges and status`

**Commit L-7**
- **Objetivo:** Dialog para editar el rol de un usuario (ADMIN puede asignar cualquier rol)
- **Componentes:** Dialog inline en `UserListComponent`, usa `user.service.ts::updateRole()`
- **Archivos:** `features/admin/user-list/user-list.component.{ts,html}`
- **Commit:** `feat: add user role editor dialog in admin panel`

**Commit L-8**
- **Objetivo:** Acción de desactivar usuario con `p-confirmDialog` de PrimeNG
- **Componentes:** Actualizar `UserListComponent` con flujo de confirmación
- **Archivos:** `features/admin/user-list/user-list.component.{ts,html}`
- **Commit:** `feat: implement user deactivation with confirmation dialog`

**Commit L-9**
- **Objetivo:** Componentes reutilizables para eliminar duplicación entre features
- **Componentes:** `LoadingSpinnerComponent`, `EmptyStateComponent`, `PageHeaderComponent`
- **Archivos:** `shared/components/loading-spinner/`, `shared/components/empty-state/`, `shared/components/page-header/`
- **Commit:** `feat: add shared loading-spinner, empty-state and page-header components`

**Commit L-10**
- **Objetivo:** Páginas de error 404 (not found) y 403 (unauthorized) con link de regreso
- **Componentes:** `NotFoundComponent`, `UnauthorizedComponent`
- **Archivos:** `features/errors/not-found/not-found.component.{ts,html,css}`, `features/errors/unauthorized/unauthorized.component.{ts,html,css}`, `app.routes.ts`
- **Commit:** `feat: add not-found and unauthorized error pages`

---

### BRIAN VARGAS — 10 commits

**Commit B-1**
- **Objetivo:** Interfaces y DTOs TypeScript para el modelo de órdenes
- **Componentes:** Tipos: `Order`, `OrderItem`, `OrderStatus`, `PaymentMethod`, `CreateOrderDto`, `UpdateOrderDto`
- **Archivos:** `shared/models/order.model.ts`
- **Commit:** `feat: add order TypeScript model interfaces and DTOs`

**Commit B-2**
- **Objetivo:** Servicio con todos los métodos del API de órdenes
- **Componentes:** `OrderService` con: `getAll()`, `getById()`, `create()`, `updateStatus()`, `delete()`
- **Archivos:** `core/services/order.service.ts`
- **Commit:** `feat: implement order service with full CRUD and status endpoints`

**Commit B-3**
- **Objetivo:** Registrar rutas de órdenes y añadir enlace "Órdenes" en el navbar
- **Componentes:** Rutas: `/orders`, `/orders/new`, `/orders/:id`; actualizar `app.html`
- **Archivos:** `app.routes.ts`, `app.html`, `app.css`
- **Commit:** `feat: add orders routes and navbar link`

**Commit B-4**
- **Objetivo:** Tabla de órdenes filtrable por estado (PENDING/COMPLETED/CANCELLED) con paginación
- **Componentes:** `OrderListComponent` con `p-table`, dropdown de estado, badges de status
- **Archivos:** `features/orders/order-list/order-list.component.{ts,html,css}`
- **Commit:** `feat: build order list component with status filter and pagination`

**Commit B-5**
- **Objetivo:** Vista detallada de una orden con tabla de items, total, estado y metadatos
- **Componentes:** `OrderDetailComponent` con `p-card`, tabla de items, pipe de moneda COP
- **Archivos:** `features/orders/order-detail/order-detail.component.{ts,html,css}`
- **Commit:** `feat: implement order detail view with items table and totals`

**Commit B-6**
- **Objetivo:** Dialog para que CASHIER/ADMIN actualicen el estado de una orden
- **Componentes:** Dialog inline en `OrderDetailComponent`, muestra roles habilitados
- **Archivos:** `features/orders/order-detail/order-detail.component.{ts,html}`
- **Commit:** `feat: add order status update dialog in order detail`

**Commit B-7**
- **Objetivo:** Componente de carrito reutilizable: buscar producto, agregar con cantidad, calcular totales
- **Componentes:** `CartComponent` con lista de items, controles de cantidad, subtotal por item y total
- **Archivos:** `features/orders/order-create/cart/cart.component.{ts,html,css}`
- **Commit:** `feat: build cart component with product search and quantity controls`

**Commit B-8**
- **Objetivo:** Página completa de POS: buscar/agregar productos al carrito, elegir método de pago, confirmar orden
- **Componentes:** `OrderCreateComponent` integrando `CartComponent` + `ProductService` + `OrderService`
- **Archivos:** `features/orders/order-create/order-create.component.{ts,html,css}`
- **Commit:** `feat: implement POS order create page with cart and payment selector`

**Commit B-9**
- **Objetivo:** Botón "Generar Factura" en `OrderDetailComponent` cuando el estado es COMPLETED
- **Componentes:** Botón condicional en order-detail, usa `invoice.service.ts::create()`
- **Archivos:** `features/orders/order-detail/order-detail.component.{ts,html}`
- **Commit:** `feat: add generate invoice button to completed order detail`

**Commit B-10**
- **Objetivo:** Acción de cancelar una orden desde la lista con `p-confirmDialog` y actualización inmediata de la tabla
- **Componentes:** Actualizar `OrderListComponent` con botón de cancelar y confirmación
- **Archivos:** `features/orders/order-list/order-list.component.{ts,html}`
- **Commit:** `feat: add order cancel confirmation flow in order list`

---

## Orden de ejecución sugerido

Las dependencias críticas son:
1. **B-1 y B-2** antes de cualquier commit de órdenes
2. **L-1** antes de **S-8** (panel low-stock va en dashboard)
3. **L-4** (role guard) antes de **L-5** (admin layout)
4. **L-5** antes de **L-6, L-7, L-8** (admin user management)
5. **L-9** (shared components) puede hacerse en paralelo y aplicarse progresivamente

Orden recomendado por sprint:

| Sprint | Commits |
|--------|---------|
| 1 (base) | B-1, B-2, B-3, L-9, S-3 |
| 2 (órdenes) | B-4, B-5, B-6, B-7, B-8 |
| 3 (dashboard + admin) | L-1, L-2, L-3, L-4, L-5 |
| 4 (admin + UX) | L-6, L-7, L-8, S-1, S-2 |
| 5 (cierre) | B-9, B-10, L-10, S-4, S-5, S-6, S-7, S-8 |

---

## Verificación

Para validar el frontend completo:

1. `cd frontend && pnpm install && ng serve`
2. `cd backend && pnpm run dev` (requiere `.env` con `MONGO_URI` y `JWT_SECRET`)
3. Flujo completo:
   - Registrar usuario → login → ver dashboard con KPIs
   - Crear orden desde POS (seleccionar productos, confirmar)
   - Cambiar estado de orden a COMPLETED → generar factura
   - Ver factura generada → descargar PDF
   - Admin: cambiar rol de usuario, desactivar usuario
   - Probar ruta admin sin rol ADMIN → redirigir a /unauthorized
   - Probar URL inexistente → ver página 404