export const convertUnit = (value, fromUnit, toUnit, isPrice = false) => {
  if (fromUnit === toUnit) return value;
  
  const factors = {
    'g': 1,
    'kg': 1000,
    'mL': 1,
    'L': 1000,
    'unit': 1
  };

  // Check if they are in the same dimension (mass vs volume vs unit)
  const massUnits = ['g', 'kg'];
  const volumeUnits = ['mL', 'L'];
  
  const getDimension = (unit) => {
    if (massUnits.includes(unit)) return 'mass';
    if (volumeUnits.includes(unit)) return 'volume';
    return 'count';
  };

  if (getDimension(fromUnit) !== getDimension(toUnit)) {
    // Cannot convert between different dimensions (e.g., mass to volume), return original
    return null;
  }

  // To convert value: 
  // If price: $1/g = $1000/kg. (multiply by toUnitFactor / fromUnitFactor)
  // If quantity: 1000g = 1kg. (multiply by fromUnitFactor / toUnitFactor)
  
  let convertedValue = value;
  if (isPrice) {
    convertedValue = value * (factors[toUnit] / factors[fromUnit]);
  } else {
    convertedValue = value * (factors[fromUnit] / factors[toUnit]);
  }

  return convertedValue;
};
