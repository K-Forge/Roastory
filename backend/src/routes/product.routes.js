const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock
} = require('../controllers/product.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, requireRole(['ADMIN', 'INVENTORY_MANAGER']), createProduct);

router.get('/', getProducts);

router.get('/:id', getProductById);

router.put('/:id', verifyToken, requireRole(['ADMIN', 'INVENTORY_MANAGER']), updateProduct);

router.patch('/:id/stock', verifyToken, requireRole(['ADMIN', 'INVENTORY_MANAGER']), updateStock);

router.delete('/:id', verifyToken, requireRole(['ADMIN', 'INVENTORY_MANAGER']), deleteProduct);

module.exports = router;
