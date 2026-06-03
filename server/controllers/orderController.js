const prisma = require('../models/prismaClient');
const conversionService = require('../utils/conversionService');

const getDimension = (unit) => {
  if (['g', 'kg', 'mg'].includes(unit)) return 'weight';
  if (['mL', 'L'].includes(unit)) return 'volume';
  return 'count';
};

const createQuotation = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { productId, quantity, unitUsed }
    if (!items || !items.length) {
      return res.status(400).json({ error: "Items array is required" });
    }

    let totalPrice = 0;
    const orderItemsData = [];

    // Pre-calculate totals and validate
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: parseInt(item.productId) } });
      if (!product) {
        return res.status(404).json({ error: `Product not found with ID ${item.productId}` });
      }

      const dimension = getDimension(product.baseUnit);
      
      // Calculate unit price for the requested unit
      const unitPriceAtOrder = conversionService.getPriceInUnit(
        parseFloat(product.basePrice), 
        item.unitUsed, 
        dimension
      );
      
      const lineTotal = item.quantity * unitPriceAtOrder;
      totalPrice += lineTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitUsed: item.unitUsed,
        unitPriceAtOrder,
        lineTotal
      });
    }

    // Create Order and OrderItems in a transaction
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        status: 'QUOTATION',
        totalPrice,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getMyQuotations = async (req, res, next) => {
  try {
    const quotations = await prisma.order.findMany({
      where: { 
        userId: req.user.id,
        status: 'QUOTATION'
      },
      include: { items: { include: { product: true } } }
    });
    res.json(quotations);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { 
        userId: req.user.id,
        status: { not: 'QUOTATION' }
      },
      include: { items: { include: { product: true } } }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const placeOrder = async (req, res, next) => {
  try {
    const { id } = req.params; // Quotation ID

    const result = await prisma.$transaction(async (tx) => {
      const quotation = await tx.order.findUnique({
        where: { id: parseInt(id) },
        include: { items: { include: { product: true } } }
      });

      if (!quotation) {
        throw new Error("Quotation not found");
      }

      if (quotation.userId !== req.user.id && req.user.role !== 'ADMIN') {
        throw new Error("Unauthorized access to this quotation");
      }

      if (quotation.status !== 'QUOTATION') {
        throw new Error("Order is already placed or invalid status");
      }

      // Check stock and deduct inventory
      for (const item of quotation.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        const dimension = getDimension(product.baseUnit);
        
        // Convert ordered quantity to base unit to compare with stock
        const quantityInBaseUnit = conversionService.convert(
          parseFloat(item.quantity), 
          item.unitUsed, 
          product.baseUnit, 
          dimension
        );

        if (parseFloat(product.stockQuantity) < quantityInBaseUnit) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        // Deduct inventory
        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: {
              decrement: quantityInBaseUnit
            }
          }
        });
      }

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: parseInt(id) },
        data: { status: 'CONFIRMED' },
        include: { items: true }
      });

      return updatedOrder;
    });

    res.json({ message: "Order placed successfully", order: result });
  } catch (error) {
    if (error.message.includes("Insufficient stock") || error.message.includes("not found") || error.message.includes("Unauthorized") || error.message.includes("already placed")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const getAllOrdersForAdmin = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Forbidden: You do not have access to this order" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuotation,
  getMyQuotations,
  getMyOrders,
  placeOrder,
  getAllOrdersForAdmin,
  getOrderDetails
};
