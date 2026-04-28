const Product = require('../models/product.model');

const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, sku, author } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: 'Los campos name, category y price son obligatorios'
      });
    }

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      stock,
      sku,
      author
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: savedProduct
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ya existe un producto con ese SKU',
        error: error.message
      });
    }
    res.status(500).json({
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, active } = req.query;
    const filter = {};

    if (category) filter.category = category.toUpperCase();
    if (active !== undefined) filter.isActive = active === 'true';

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ message: 'El campo quantity es obligatorio' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      return res.status(400).json({
        message: 'Stock insuficiente',
        currentStock: product.stock
      });
    }

    product.stock = newStock;
    await product.save();

    res.status(200).json({
      message: 'Stock actualizado exitosamente',
      product
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar stock',
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock
};