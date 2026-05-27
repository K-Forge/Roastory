require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Invoice = require('../models/invoice.model');

const TAX_RATE = 0.19;

// ── DATOS ────────────────────────────────────────────────────────────────────

const usersData = [
  // Personal del negocio
  { name: 'Administrador General',  email: 'admin@roastory.com',       password: 'Admin123!', role: 'ADMIN' },
  { name: 'Gestor de Inventario',   email: 'inventario@roastory.com',  password: 'Admin123!', role: 'INVENTORY_MANAGER' },
  { name: 'Cajero Principal',       email: 'cajero@roastory.com',      password: 'Admin123!', role: 'CASHIER' },
  // Clientes colombianos
  { name: 'María González',         email: 'maria.gonzalez@gmail.com', password: 'Cliente1!', role: 'CUSTOMER' },
  { name: 'Carlos Rodríguez',       email: 'carlos.rodriguez@gmail.com',password: 'Cliente1!', role: 'CUSTOMER' },
  { name: 'Ana Martínez',           email: 'ana.martinez@gmail.com',   password: 'Cliente1!', role: 'CUSTOMER' },
  { name: 'Luis Hernández',         email: 'luis.hernandez@gmail.com', password: 'Cliente1!', role: 'CUSTOMER' },
  { name: 'Diana Pérez',            email: 'diana.perez@gmail.com',    password: 'Cliente1!', role: 'CUSTOMER' },
];

const productsData = [
  // Cafés
  { name: 'Café Americano',            description: 'Café negro tostado suave, ideal para las mañanas',           category: 'COFFEE',  price: 4500,  stock: 80, sku: 'CAF-001' },
  { name: 'Café Latte',                description: 'Espresso con leche vaporizada y espuma cremosa',             category: 'COFFEE',  price: 6000,  stock: 60, sku: 'CAF-002' },
  { name: 'Capuccino',                 description: 'Espresso con leche vaporizada y abundante espuma',           category: 'COFFEE',  price: 6500,  stock: 55, sku: 'CAF-003' },
  { name: 'Espresso',                  description: 'Café concentrado de sabor intenso, servido en taza pequeña', category: 'COFFEE',  price: 3500,  stock: 90, sku: 'CAF-004' },
  { name: 'Mocaccino',                 description: 'Espresso con chocolate y leche vaporizada',                  category: 'COFFEE',  price: 7000,  stock: 45, sku: 'CAF-005' },
  // Libros de literatura latinoamericana
  { name: 'Cien Años de Soledad',      description: 'Gabriel García Márquez — Editorial Sudamericana, 1967',      category: 'BOOK',    price: 45000, stock: 15, sku: 'LIB-001', author: 'Gabriel García Márquez' },
  { name: 'El Amor en los Tiempos del Cólera', description: 'Gabriel García Márquez — Editorial Oveja Negra, 1985', category: 'BOOK', price: 42000, stock: 12, sku: 'LIB-002', author: 'Gabriel García Márquez' },
  { name: 'La Ciudad y los Perros',    description: 'Mario Vargas Llosa — Editorial Seix Barral, 1963',           category: 'BOOK',    price: 38000, stock: 10, sku: 'LIB-003', author: 'Mario Vargas Llosa' },
  { name: 'Rayuela',                   description: 'Julio Cortázar — Editorial Sudamericana, 1963',              category: 'BOOK',    price: 40000, stock: 8,  sku: 'LIB-004', author: 'Julio Cortázar' },
  { name: 'Pedro Páramo',              description: 'Juan Rulfo — Fondo de Cultura Económica, 1955',              category: 'BOOK',    price: 35000, stock: 20, sku: 'LIB-005', author: 'Juan Rulfo' },
  // Repostería
  { name: 'Croissant de Mantequilla', description: 'Hojaldre crujiente con mantequilla francesa',                 category: 'PASTRY',  price: 4500,  stock: 30, sku: 'REP-001', imageUrl: null },
  { name: 'Brownie de Chocolate',     description: 'Brownie húmedo con chispas de chocolate amargo',              category: 'PASTRY',  price: 5000,  stock: 25, sku: 'REP-002', imageUrl: null },
  { name: 'Muffin de Arándanos',      description: 'Muffin esponjoso con arándanos frescos y azúcar morena',     category: 'PASTRY',  price: 4000,  stock: 35, sku: 'REP-003', imageUrl: null },
  { name: 'Cheesecake de Frutos Rojos',description: 'Cheesecake cremoso con coulis de frutos rojos',             category: 'PASTRY',  price: 8500,  stock: 20, sku: 'REP-004', imageUrl: null },
  { name: 'Torta Tres Leches',        description: 'Bizcocho bañado en tres tipos de leche, con crema batida',   category: 'PASTRY',  price: 7500,  stock: 15, sku: 'REP-005', imageUrl: null },
  // Cafés adicionales
  { name: 'Cold Brew',                description: 'Café preparado en frío durante 12 horas, suave y refrescante', category: 'COFFEE', price: 7500,  stock: 40, sku: 'CAF-006', imageUrl: null },
  { name: 'Matcha Latte',             description: 'Té matcha japonés con leche vaporizada y miel',               category: 'COFFEE', price: 8000,  stock: 30, sku: 'CAF-007', imageUrl: null },
  { name: 'Café con Canela',          description: 'Espresso suavizado con canela molida y un toque de panela',   category: 'COFFEE', price: 5500,  stock: 50, sku: 'CAF-008', imageUrl: null },
  // Libros adicionales
  { name: 'Ficciones',                description: 'Jorge Luis Borges — Emecé Editores, 1944',                    category: 'BOOK',   price: 36000, stock: 12, sku: 'LIB-006', author: 'Jorge Luis Borges',   imageUrl: null },
  { name: 'La Casa de los Espíritus', description: 'Isabel Allende — Plaza & Janés, 1982',                        category: 'BOOK',   price: 43000, stock: 9,  sku: 'LIB-007', author: 'Isabel Allende',      imageUrl: null },
  { name: 'El Túnel',                 description: 'Ernesto Sabato — Editorial Sur, 1948',                        category: 'BOOK',   price: 32000, stock: 14, sku: 'LIB-008', author: 'Ernesto Sabato',      imageUrl: null },
  // Repostería adicional
  { name: 'Torta de Zanahoria',       description: 'Bizcocho húmedo de zanahoria con frosting de queso crema',   category: 'PASTRY', price: 6500,  stock: 18, sku: 'REP-006', imageUrl: null },
  { name: 'Galleta de Mantequilla',   description: 'Galleta crujiente con mantequilla y esencia de vainilla',    category: 'PASTRY', price: 2500,  stock: 50, sku: 'REP-007', imageUrl: null },
  { name: 'Empanada de Guayaba',      description: 'Hojaldre relleno de bocadillo de guayaba colombiano',        category: 'PASTRY', price: 3500,  stock: 40, sku: 'REP-008', imageUrl: null },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

// Construye un ítem de orden y calcula el subtotal para la factura
const buildOrderItems = (products, selections) => {
  return selections.map(({ index, quantity }) => ({
    product: products[index]._id,
    quantity,
    price: products[index].price
  }));
};

const calcTotal = (items) =>
  items.reduce((acc, item) => acc + item.quantity * item.price, 0);

// ── SEED PRINCIPAL ────────────────────────────────────────────────────────────

const seed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI no encontrado en .env');
    process.exit(1);
  }

  console.log('Conectando a MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Conectado a: ${mongoose.connection.name}\n`);

  // 1. Limpiar colecciones
  console.log('Limpiando colecciones existentes...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Invoice.deleteMany({})
  ]);
  console.log('Colecciones limpias.\n');

  // 2. Crear usuarios con contraseñas hasheadas
  console.log('Creando usuarios...');
  const hashedUsers = await Promise.all(
    usersData.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10)
    }))
  );
  const users = await User.insertMany(hashedUsers);
  console.log(`  Usuarios creados: ${users.length}`);
  console.log(`    Staff  → admin@roastory.com (ADMIN), inventario@roastory.com (INVENTORY_MANAGER), cajero@roastory.com (CASHIER)`);
  console.log(`    Clientes → ${users.slice(3).map(u => u.name).join(', ')}\n`);

  // Referencias fáciles
  const [admin, , cajero] = users;
  const customers = users.slice(3); // índices 3-7

  // 3. Crear productos
  console.log('Creando productos...');
  const products = await Product.insertMany(productsData);
  console.log(`  Productos creados: ${products.length}`);
  console.log(`    Cafés: ${products.slice(0,5).map(p => p.name).join(', ')}`);
  console.log(`    Libros: ${products.slice(5,10).map(p => p.name).join(', ')}`);
  console.log(`    Repostería: ${products.slice(10,15).map(p => p.name).join(', ')}\n`);

  // 4. Crear órdenes
  console.log('Creando órdenes...');

  const ordersData = [
    // 5 órdenes COMPLETED — estas se facturan
    {
      customer: customers[0]._id,
      items: buildOrderItems(products, [{ index: 0, quantity: 2 }, { index: 10, quantity: 1 }]),
      status: 'COMPLETED',
      paymentMethod: 'CASH'
    },
    {
      customer: customers[1]._id,
      items: buildOrderItems(products, [{ index: 1, quantity: 1 }, { index: 5, quantity: 1 }]),
      status: 'COMPLETED',
      paymentMethod: 'CREDIT_CARD'
    },
    {
      customer: customers[2]._id,
      items: buildOrderItems(products, [{ index: 2, quantity: 2 }, { index: 11, quantity: 2 }]),
      status: 'COMPLETED',
      paymentMethod: 'DEBIT_CARD'
    },
    {
      customer: customers[3]._id,
      items: buildOrderItems(products, [{ index: 3, quantity: 1 }, { index: 8, quantity: 1 }]),
      status: 'COMPLETED',
      paymentMethod: 'TRANSFER'
    },
    {
      customer: customers[4]._id,
      items: buildOrderItems(products, [{ index: 4, quantity: 1 }, { index: 13, quantity: 1 }]),
      status: 'COMPLETED',
      paymentMethod: 'CASH'
    },
    // 2 órdenes PENDING
    {
      customer: customers[0]._id,
      items: buildOrderItems(products, [{ index: 0, quantity: 1 }, { index: 12, quantity: 2 }]),
      status: 'PENDING',
      paymentMethod: 'CASH'
    },
    {
      customer: customers[1]._id,
      items: buildOrderItems(products, [{ index: 1, quantity: 2 }, { index: 12, quantity: 1 }]),
      status: 'PENDING',
      paymentMethod: 'CREDIT_CARD'
    },
    // 1 orden CANCELLED
    {
      customer: customers[2]._id,
      items: buildOrderItems(products, [{ index: 3, quantity: 1 }]),
      status: 'CANCELLED',
      paymentMethod: 'CASH'
    }
  ];

  // Calcular totalAmount de cada orden antes de insertar
  const ordersWithTotal = ordersData.map((o) => ({
    ...o,
    totalAmount: calcTotal(o.items)
  }));

  const orders = await Order.insertMany(ordersWithTotal);
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  console.log(`  Órdenes creadas: ${orders.length}`);
  console.log(`    COMPLETED: ${completedOrders.length}  |  PENDING: ${orders.filter(o => o.status === 'PENDING').length}  |  CANCELLED: ${orders.filter(o => o.status === 'CANCELLED').length}\n`);

  // 5. Crear facturas para las órdenes COMPLETED
  console.log('Creando facturas...');

  // Necesitamos los nombres de los productos para el snapshot
  const productMap = {};
  products.forEach(p => { productMap[p._id.toString()] = p; });

  const invoices = [];

  for (const order of completedOrders) {
    // Construir snapshot de ítems con nombre del producto
    const items = order.items.map((item) => {
      const prod = productMap[item.product.toString()];
      return {
        productName: prod.name,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.quantity * item.price
      };
    });

    const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    // Se genera el número y se guarda de inmediato para que el contador
    // de la BD esté actualizado antes de la siguiente iteración
    const invoiceNumber = await Invoice.generateInvoiceNumber();
    const invoice = await Invoice.create({
      order: order._id,
      customer: order.customer,
      invoiceNumber,
      items,
      subtotal,
      tax,
      total,
      paymentMethod: order.paymentMethod,
      status: 'ISSUED'
    });

    invoices.push(invoice);
  }
  console.log(`  Facturas creadas: ${invoices.length}`);
  invoices.forEach(inv => {
    console.log(`    ${inv.invoiceNumber}  →  Total: $${inv.total.toLocaleString('es-CO')}  |  ${inv.paymentMethod}`);
  });

  // ── RESUMEN FINAL ──────────────────────────────────────────────────────────
  console.log('\n────────────────────────────────────────');
  console.log('  Seed completado exitosamente');
  console.log('────────────────────────────────────────');
  console.log(`  Usuarios   : ${users.length}`);
  console.log(`  Productos  : ${products.length}`);
  console.log(`  Órdenes    : ${orders.length}`);
  console.log(`  Facturas   : ${invoices.length}`);
  console.log('────────────────────────────────────────');
  console.log('\n  Credenciales de prueba:');
  console.log('  ADMIN              → admin@roastory.com       / Admin123!');
  console.log('  INVENTORY_MANAGER  → inventario@roastory.com  / Admin123!');
  console.log('  CASHIER            → cajero@roastory.com      / Admin123!');
  console.log('  CUSTOMER           → maria.gonzalez@gmail.com / Cliente1!');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('\nError durante el seed:', err.message);
  process.exit(1);
});
