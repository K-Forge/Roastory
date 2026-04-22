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

router.post('/', createProduct);

router.get('/', getProducts);

router.get('/:id', getProductById);

router.put('/:id', updateProduct);

router.patch('/:id/stock', updateStock);

router.delete('/:id', deleteProduct);

module.exports = router;