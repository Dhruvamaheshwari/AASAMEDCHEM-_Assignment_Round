const prisma = require('./prismaClient');

const getConversionFactor = async (fromUnit, toUnit) => {
    return await prisma.unitConversion.findFirst({
        where: {
            fromUnit,
            toUnit
        }
    });
};

module.exports = {
    getConversionFactor
};
