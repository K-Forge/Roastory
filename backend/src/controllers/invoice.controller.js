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

module.exports = {
  createInvoice,
  getInvoices,
  getMyInvoices,
  getInvoiceById,
  voidInvoice,
};
