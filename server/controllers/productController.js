const productModel = require("../models/productModel");

const getAllProducts = async (req, res, next) => {
  try {
    const { search } = req.query;
    const products = await productModel.getAllProducts(search);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, baseUnit, basePrice, stockQuantity } = req.body;
    const product = await productModel.createProduct({
      name,
      sku,
      description,
      baseUnit,
      basePrice,
      stockQuantity: stockQuantity || 0,
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, sku, description, baseUnit, basePrice, stockQuantity } = req.body;
    const product = await productModel.updateProduct(id, {
      name,
      sku,
      description,
      baseUnit,
      basePrice,
      stockQuantity,
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productModel.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
