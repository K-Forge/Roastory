const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getInvoices,
} = require('../controllers/invoice.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, requireRole(['ADMIN', 'CASHIER']), createInvoice);

router.get('/', verifyToken, requireRole(['ADMIN']), getInvoices);


module.exports = router;
