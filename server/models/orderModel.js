const prisma = require('./prismaClient');

const createOrder = async (userId, totalPrice) => {
    return await prisma.order.create({
        data: {
            userId: parseInt(userId),
            totalPrice
        }
    });
};

const getOrdersByUser = async (userId) => {
    return await prisma.order.findMany({
        where: { userId: parseInt(userId) },
        include: { items: true }
    });
};

const getAllOrders = async () => {
    return await prisma.order.findMany({
        include: { items: true, user: true }
    });
};

const updateOrderStatus = async (id, status) => {
    return await prisma.order.update({
        where: { id: parseInt(id) },
        data: { status }
    });
};

module.exports = {
    createOrder,
    getOrdersByUser,
    getAllOrders,
    updateOrderStatus
};
