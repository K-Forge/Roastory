const Invoice = require('../models/invoice.model');
const Order = require('../models/order.model');
const PDFDocument = require('pdfkit');

const TAX_RATE = 0.19;

const createInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'El campo orderId es obligatorio' });
    }

    const order = await Order.findById(orderId).populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    if (order.status !== 'COMPLETED') {
      return res.status(400).json({
        message: 'Solo se pueden facturar órdenes con estado COMPLETED',
        currentStatus: order.status
      });
    }

    const existingInvoice = await Invoice.findOne({ order: orderId });
    if (existingInvoice) {
      return res.status(400).json({
        message: 'Esta orden ya tiene una factura asociada',
        invoiceId: existingInvoice._id,
        invoiceNumber: existingInvoice.invoiceNumber
      });
    }

    const items = order.items.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.quantity * item.price
    }));

    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

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

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate('customer', 'name email')
      .populate('order', 'status totalAmount paymentMethod');

    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

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

const downloadInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id).populate('customer', 'name email');

    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    const isPrivileged = ['ADMIN', 'CASHIER'].includes(req.user.role);
    const isOwner = invoice.customer._id.toString() === req.user.id;

    if (!isPrivileged && !isOwner) {
      return res.status(403).json({ message: 'No tienes permiso para descargar esta factura' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=factura-${invoice.invoiceNumber}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });

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

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#cccccc')
      .stroke();

    doc.moveDown(1);

    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text('FACTURA', 50);
    doc.moveDown(0.3);

    doc.font('Helvetica').fontSize(10);
    doc.text(`Número:`, 50, doc.y, { continued: true }).font('Helvetica-Bold').text(`  ${invoice.invoiceNumber}`);
    doc.font('Helvetica').text(`Fecha de emisión:`, 50, doc.y, { continued: true }).text(`  ${invoice.issuedAt.toLocaleDateString('es-CO')}`);
    doc.text(`Estado:`, 50, doc.y, { continued: true }).text(`  ${invoice.status}`);
    doc.text(`Método de pago:`, 50, doc.y, { continued: true }).text(`  ${invoice.paymentMethod}`);

    doc.moveDown(1);

    doc.font('Helvetica-Bold').fontSize(10).text('CLIENTE');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10);
    doc.text(`Nombre:`, 50, doc.y, { continued: true }).text(`  ${invoice.customer.name}`);
    doc.text(`Email:`, 50, doc.y, { continued: true }).text(`  ${invoice.customer.email}`);

    doc.moveDown(1);

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

    let rowY = tableTop + 22;
    doc.fillColor('#000000').font('Helvetica').fontSize(9);

    invoice.items.forEach((item, index) => {
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

    doc
      .moveTo(50, rowY)
      .lineTo(545, rowY)
      .strokeColor('#cccccc')
      .stroke();

    doc.moveDown(1.5);

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
