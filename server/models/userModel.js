const prisma = require('./prismaClient');

const createUser = async (userData) => {
    return await prisma.user.create({
        data: userData
    });
};

const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: parseInt(id) }
    });
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};
