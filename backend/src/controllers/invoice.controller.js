const Invoice = require('../models/invoice.model');
const Order = require('../models/order.model');
const PDFDocument = require('pdfkit');

const TAX_RATE = 0.19; // IVA Colombia

// POST /api/invoices — Generar una factura a partir de una orden completada
const TAX_RATE = 0.19;

const createInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'El campo orderId es obligatorio' });
    }

    // Buscar la orden y traer el nombre y precio de cada producto
    const order = await Order.findById(orderId).populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Solo se puede facturar una orden que ya esté completada
    if (order.status !== 'COMPLETED') {
      return res.status(400).json({
        message: 'Solo se pueden facturar órdenes con estado COMPLETED',
        currentStatus: order.status
      });
    }

    // Verificar que la orden no tenga ya una factura (order es unique en el modelo)
    const existingInvoice = await Invoice.findOne({ order: orderId });
    if (existingInvoice) {
      return res.status(400).json({
        message: 'Esta orden ya tiene una factura asociada',
        invoiceId: existingInvoice._id,
        invoiceNumber: existingInvoice.invoiceNumber
      });
    }

    // Construir el snapshot de ítems — se guarda el nombre y precio del momento actual,
    // no una referencia, para que la factura sea inmutable ante cambios futuros
    const items = order.items.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.quantity * item.price
    }));

    // Calcular totales
    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    // Generar número de factura secuencial (INV-2026-00001)
    const invoiceNumber = await Invoice.generateInvoiceNumber();

    const newInvoice = new Invoice({
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

    const savedInvoice = await newInvoice.save();

    res.status(201).json({
      message: 'Factura generada exitosamente',
      invoice: savedInvoice
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar la factura', error: error.message });
  }
};

// GET /api/invoices — Listar todas las facturas (solo ADMIN)
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customer', 'name email')
      .populate('order', 'status totalAmount')
      .sort({ issuedAt: -1 });

    res.status(200).json({
      count: invoices.length,
      invoices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las facturas', error: error.message });
  }
};

// GET /api/invoices/me — Facturas del usuario autenticado
const getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ customer: req.user.id })
      .populate('order', 'status totalAmount')
      .sort({ issuedAt: -1 });

    res.status(200).json({
      count: invoices.length,
      invoices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus facturas', error: error.message });
  }
};

// GET /api/invoices/:id — Obtener una factura específica
// Acceso: ADMIN, CASHIER, o el cliente dueño de la factura
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate('customer', 'name email')
      .populate('order', 'status totalAmount paymentMethod');

    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    // Si el usuario no es ADMIN ni CASHIER, solo puede ver su propia factura
    const isPrivileged = ['ADMIN', 'CASHIER'].includes(req.user.role);
    const isOwner = invoice.customer._id.toString() === req.user.id;

    if (!isPrivileged && !isOwner) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta factura' });
    }

    res.status(200).json({ invoice });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la factura', error: error.message });
  }
};

// PATCH /api/invoices/:id/void — Anular una factura (solo ADMIN)
// No se elimina — se marca como VOIDED para mantener integridad fiscal
const voidInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    if (invoice.status === 'VOIDED') {
      return res.status(400).json({ message: 'La factura ya está anulada' });
    }

    invoice.status = 'VOIDED';
    await invoice.save();

    res.status(200).json({
      message: 'Factura anulada exitosamente',
      invoice
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al anular la factura', error: error.message });
  }
};

// GET /api/invoices/:id/pdf — Genera y descarga el PDF de la factura
const downloadInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id).populate('customer', 'name email');

    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    // Verificar permisos: ADMIN, CASHIER o el cliente dueño
    const isPrivileged = ['ADMIN', 'CASHIER'].includes(req.user.role);
    const isOwner = invoice.customer._id.toString() === req.user.id;

    if (!isPrivileged && !isOwner) {
      return res.status(403).json({ message: 'No tienes permiso para descargar esta factura' });
    }

    // Configurar headers para que el navegador descargue el archivo
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=factura-${invoice.invoiceNumber}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });

    // Conectar el stream del PDF directamente a la respuesta HTTP
    doc.pipe(res);

    // ── ENCABEZADO ──────────────────────────────────────────────────────────
    doc.pipe(res);

    doc
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('ROASTORY', { align: 'center' });

    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#555555')
      .text('Librería - Cafetería', { align: 'center' });

    doc.moveDown(0.5);

    // Línea divisora
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#cccccc')
      .stroke();

    doc.moveDown(1);

    // ── DATOS DE LA FACTURA ─────────────────────────────────────────────────
    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text('FACTURA', 50);
    doc.moveDown(0.3);

    doc.font('Helvetica').fontSize(10);
    doc.text(`Número:`, 50, doc.y, { continued: true }).font('Helvetica-Bold').text(`  ${invoice.invoiceNumber}`);
    doc.font('Helvetica').text(`Fecha de emisión:`, 50, doc.y, { continued: true }).text(`  ${invoice.issuedAt.toLocaleDateString('es-CO')}`);
    doc.text(`Estado:`, 50, doc.y, { continued: true }).text(`  ${invoice.status}`);
    doc.text(`Método de pago:`, 50, doc.y, { continued: true }).text(`  ${invoice.paymentMethod}`);

    doc.moveDown(1);

    // ── DATOS DEL CLIENTE ───────────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(10).text('CLIENTE');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10);
    doc.text(`Nombre:`, 50, doc.y, { continued: true }).text(`  ${invoice.customer.name}`);
    doc.text(`Email:`, 50, doc.y, { continued: true }).text(`  ${invoice.customer.email}`);

    doc.moveDown(1);

    // ── TABLA DE ÍTEMS ──────────────────────────────────────────────────────
    doc.font('Helvetica-Bold').fontSize(10).text('DETALLE DE PRODUCTOS');
    doc.moveDown(0.5);

    // Encabezado de la tabla
    doc.font('Helvetica-Bold').fontSize(10).text('DETALLE DE PRODUCTOS');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const col = { producto: 50, cant: 300, precio: 370, subtotal: 460 };

    doc
      .rect(50, tableTop, 495, 20)
      .fill('#333333');

    doc
      .fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('Producto', col.producto + 4, tableTop + 5)
      .text('Cant.', col.cant + 4, tableTop + 5)
      .text('Precio unit.', col.precio + 4, tableTop + 5)
      .text('Subtotal', col.subtotal + 4, tableTop + 5);

    // Filas de productos
    let rowY = tableTop + 22;
    doc.fillColor('#000000').font('Helvetica').fontSize(9);

    invoice.items.forEach((item, index) => {
      // Fondo alterno para cada fila
      if (index % 2 === 0) {
        doc.rect(50, rowY - 2, 495, 18).fill('#f5f5f5');
      }

      doc
        .fillColor('#000000')
        .text(item.productName, col.producto + 4, rowY, { width: 230 })
        .text(String(item.quantity), col.cant + 4, rowY)
        .text(`$${item.unitPrice.toLocaleString('es-CO')}`, col.precio + 4, rowY)
        .text(`$${item.subtotal.toLocaleString('es-CO')}`, col.subtotal + 4, rowY);

      rowY += 20;
    });

    // Línea al final de la tabla
    doc
      .moveTo(50, rowY)
      .lineTo(545, rowY)
      .strokeColor('#cccccc')
      .stroke();

    doc.moveDown(1.5);

    // ── TOTALES ─────────────────────────────────────────────────────────────
    const totalsX = 370;
    doc.font('Helvetica').fontSize(10);
    doc.text('Subtotal:', totalsX, doc.y, { continued: true }).text(`$${invoice.subtotal.toLocaleString('es-CO')}`, { align: 'right' });
    doc.text('IVA (19%):', totalsX, doc.y, { continued: true }).text(`$${invoice.tax.toLocaleString('es-CO')}`, { align: 'right' });

    doc.moveDown(0.3);
    doc
      .rect(totalsX - 5, doc.y, 180, 22)
      .fill('#333333');

    doc
      .fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('TOTAL:', totalsX, doc.y + 4, { continued: true })
      .text(`$${invoice.total.toLocaleString('es-CO')}`, { align: 'right' });

    doc.fillColor('#000000');
    doc.moveDown(3);

    // ── PIE DE PÁGINA ────────────────────────────────────────────────────────
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#cccccc')
      .stroke();

    doc.moveDown(0.5);
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#888888')
      .text('Roastory — Sistema de gestión de librería-cafetería', { align: 'center' })
      .text('Este documento es una factura electrónica válida.', { align: 'center' });

    // Cerrar el documento — esto envía el PDF al cliente
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el PDF', error: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getMyInvoices,
  getInvoiceById,
  voidInvoice,
  downloadInvoicePDF
};
