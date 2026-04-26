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

router.post('/', verifyToken, requireRole(['ADMIN', 'CASHIER']), createInvoice);

router.get('/', verifyToken, requireRole(['ADMIN']), getInvoices);

router.get('/me', verifyToken, getMyInvoices);

router.get('/:id', verifyToken, getInvoiceById);

router.get('/:id/pdf', verifyToken, downloadInvoicePDF);

router.patch('/:id/void', verifyToken, requireRole(['ADMIN']), voidInvoice);

module.exports = router;
