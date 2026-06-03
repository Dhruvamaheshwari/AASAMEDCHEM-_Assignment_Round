/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const BASE_UNITS = {
  weight: "g",
  volume: "mL",
  count: "unit",
};

async function getConversionFactor(fromUnit, toUnit, dimension) {
  if (fromUnit === toUnit) return 1;

  // 1. Try direct conversion
  const direct = await prisma.unitConversion.findFirst({
    where: { fromUnit, toUnit, dimension },
  });
  if (direct) return parseFloat(direct.factor);

  // 2. Try inverse direct
  const inverse = await prisma.unitConversion.findFirst({
    where: { fromUnit: toUnit, toUnit: fromUnit, dimension },
  });
  if (inverse) return 1 / parseFloat(inverse.factor);

  // 3. Try via base unit
  const baseUnit = BASE_UNITS[dimension];
  if (!baseUnit) throw new Error(`Unknown dimension: ${dimension}`);

  let factorToBase = 1;
  let factorFromBase = 1;

  if (fromUnit !== baseUnit) {
    const toBase = await prisma.unitConversion.findFirst({
      where: { fromUnit, toUnit: baseUnit, dimension },
    });
    if (toBase) {
      factorToBase = parseFloat(toBase.factor);
    } else {
      const invToBase = await prisma.unitConversion.findFirst({
        where: { fromUnit: baseUnit, toUnit: fromUnit, dimension },
      });
      if (invToBase) factorToBase = 1 / parseFloat(invToBase.factor);
      else
        throw new Error(
          `Missing conversion factor to base unit for ${fromUnit}`,
        );
    }
  }

  if (toUnit !== baseUnit) {
    const fromBase = await prisma.unitConversion.findFirst({
      where: { fromUnit: baseUnit, toUnit, dimension },
    });
    if (fromBase) {
      factorFromBase = parseFloat(fromBase.factor);
    } else {
      const invFromBase = await prisma.unitConversion.findFirst({
        where: { fromUnit: toUnit, toUnit: baseUnit, dimension },
      });
      if (invFromBase) factorFromBase = 1 / parseFloat(invFromBase.factor);
      else
        throw new Error(
          `Missing conversion factor from base unit to ${toUnit}`,
        );
    }
  }

  return factorToBase * factorFromBase;
}

/**
 * Converts a quantity from one unit to another within the same dimension.
 */
async function convert(quantity, fromUnit, toUnit, dimension) {
  const factor = await getConversionFactor(fromUnit, toUnit, dimension);
  return quantity * factor;
}

/**
 * Calculates the price for a target unit based on the internal base price.
 * For example, if basePricePerBaseUnit = 0.05 INR/g and targetUnit = "kg",
 * this returns the price per "kg", which is 50 INR.
 */
async function getPriceInUnit(basePricePerBaseUnit, targetUnit, dimension) {
  const baseUnit = BASE_UNITS[dimension];
  if (baseUnit === targetUnit) return basePricePerBaseUnit;

  // Price of 1 targetUnit is equivalent to its mass/volume in base units multiplied by base price.
  // convert(1, targetUnit, baseUnit) gives how many base units are in 1 target unit.
  const factor = await getConversionFactor(targetUnit, baseUnit, dimension);
  return basePricePerBaseUnit * factor;
}

module.exports = {
  convert,
  getPriceInUnit,
  BASE_UNITS,
};
