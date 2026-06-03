const prisma = require('./prismaClient');

const addOrderItems = async (itemsData) => {
    return await prisma.orderItem.createMany({
        data: itemsData
    });
};

const getOrderItems = async (orderId) => {
    return await prisma.orderItem.findMany({
        where: { orderId: parseInt(orderId) },
        include: { product: true }
    });
};

module.exports = {
    addOrderItems,
    getOrderItems
};
