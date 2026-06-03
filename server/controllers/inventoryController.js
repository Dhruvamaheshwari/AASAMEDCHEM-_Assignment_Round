const productModel = require("../models/productModel");

const getInventory = async (req, res, next) => {
  try {
    const products = await productModel.getAllProducts();
    
    // Map to just return relevant inventory info if desired, or return full products
    const inventory = products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      baseUnit: product.baseUnit
    }));
    
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { stockQuantity } = req.body;

    if (stockQuantity === undefined || isNaN(stockQuantity)) {
      return res.status(400).json({ error: "Invalid or missing stockQuantity" });
    }

    const updatedProduct = await productModel.updateStockQuantity(productId, parseFloat(stockQuantity));
    
    res.json({
      message: "Stock updated successfully",
      inventory: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        stockQuantity: updatedProduct.stockQuantity,
        baseUnit: updatedProduct.baseUnit
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  updateStock
};
