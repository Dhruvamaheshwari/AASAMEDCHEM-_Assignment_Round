const prisma = require('./prismaClient');

const createProduct = async (productData) => {
    return await prisma.product.create({
        data: productData
    });
};

const getAllProducts = async (search) => {
    return await prisma.product.findMany({
        where: search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } }
            ]
        } : undefined
    });
};

const getProductById = async (id) => {
    return await prisma.product.findUnique({
        where: { id: parseInt(id) }
    });
};

const updateProduct = async (id, productData) => {
    return await prisma.product.update({
        where: { id: parseInt(id) },
        data: productData
    });
};

const deleteProduct = async (id) => {
    return await prisma.product.delete({
        where: { id: parseInt(id) }
    });
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
