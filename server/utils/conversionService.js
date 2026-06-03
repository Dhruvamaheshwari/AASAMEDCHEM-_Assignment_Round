const conversionFactors = {
  weight: {
    g: 1,
    kg: 1000,
    mg: 0.001
  },
  volume: {
    mL: 1,
    L: 1000
  },
  count: {
    unit: 1,
    pack: 1 // generic placeholder, can be updated based on business logic
  }
};

/**
 * Converts a quantity from one unit to another within the same dimension.
 * 
 * @param {number} quantity - The amount to convert
 * @param {string} fromUnit - The current unit (e.g., 'kg', 'g', 'L')
 * @param {string} toUnit - The target unit (e.g., 'g', 'mL')
 * @param {string} dimension - The dimension category ('weight', 'volume', 'count')
 * @returns {number} The converted quantity
 */
const convert = (quantity, fromUnit, toUnit, dimension) => {
  if (fromUnit === toUnit) return quantity;

  const factors = conversionFactors[dimension];
  if (!factors) throw new Error(`Invalid dimension: ${dimension}`);

  const fromFactor = factors[fromUnit];
  const toFactor = factors[toUnit];

  if (fromFactor === undefined) throw new Error(`Invalid fromUnit: ${fromUnit} for dimension ${dimension}`);
  if (toFactor === undefined) throw new Error(`Invalid toUnit: ${toUnit} for dimension ${dimension}`);

  // Convert to base unit, then to target unit
  const baseQuantity = quantity * fromFactor;
  return baseQuantity / toFactor;
};

/**
 * Calculates the price for a specific target unit, given the base price.
 * 
 * @param {number} basePricePerBaseUnit - The price per 1 base unit (e.g., price per 1g)
 * @param {string} targetUnit - The unit to calculate the price for (e.g., 'kg')
 * @param {string} dimension - The dimension category ('weight', 'volume', 'count')
 * @returns {number} The price per 1 target unit
 */
const getPriceInUnit = (basePricePerBaseUnit, targetUnit, dimension) => {
  const factors = conversionFactors[dimension];
  if (!factors) throw new Error(`Invalid dimension: ${dimension}`);

  const toFactor = factors[targetUnit];
  if (toFactor === undefined) throw new Error(`Invalid targetUnit: ${targetUnit} for dimension ${dimension}`);

  // If base price is $1 per 1g, then price for 1kg (1000g) is $1 * 1000
  return basePricePerBaseUnit * toFactor;
};

module.exports = {
  convert,
  getPriceInUnit
};
