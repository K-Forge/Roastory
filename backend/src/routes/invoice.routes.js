const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getMyInvoices,
  getInvoiceById,
  voidInvoice,
  downloadInvoicePDF
} = require('../controllers/invoice.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Crear factura a partir de una orden — ADMIN o CASHIER
router.post('/', verifyToken, requireRole(['ADMIN', 'CASHIER']), createInvoice);

// Listar todas las facturas — solo ADMIN
router.get('/', verifyToken, requireRole(['ADMIN']), getInvoices);

// Facturas del usuario autenticado — cualquier usuario logueado
// IMPORTANTE: esta ruta debe ir ANTES de /:id para que Express no la confunda con un ID
router.get('/me', verifyToken, getMyInvoices);

// Obtener factura por ID — ADMIN, CASHIER o el cliente dueño (lógica en el controller)
router.get('/:id', verifyToken, getInvoiceById);

// Descargar PDF de una factura
router.get('/:id/pdf', verifyToken, downloadInvoicePDF);

// Anular una factura — solo ADMIN
router.post('/', verifyToken, requireRole(['ADMIN', 'CASHIER']), createInvoice);

router.get('/', verifyToken, requireRole(['ADMIN']), getInvoices);

router.get('/me', verifyToken, getMyInvoices);

router.get('/:id', verifyToken, getInvoiceById);

router.get('/:id/pdf', verifyToken, downloadInvoicePDF);

router.patch('/:id/void', verifyToken, requireRole(['ADMIN']), voidInvoice);

module.exports = router;
