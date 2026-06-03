<!-- @format -->

# Inventory & Pricing Strategy

## Internal Base Units

To simplify database queries, prices and quantities are always standardized to their base dimensions:

- **weight**: `g` (grams)
- **volume**: `mL` (milliliters)
- **count**: `unit` (units)

## Base Price (`basePrice`)

All products store their `basePrice` as **INR per one internal base unit**.

- _Example_: A 1kg bag of flour sold for 50 INR has a `basePrice` of `50 / 1000 = 0.05` INR per gram.
- _Example_: A 2L bottle of milk for 100 INR has a `basePrice` of `100 / 2000 = 0.05` INR per mL.

## Unit Conversion (`UnitConversion` table)

The database stores standard conversion factors mapped to the internal base units. Instead of hardcoding math in Javascript, you can add or verify specific transformations in the DB:

- `kg` to `g` = `1000`
- `lb` to `g` = `453.592`

## `conversionService.js`

A standard utility to abstract the database queries dynamically:

- `convert(quantity, fromUnit, toUnit, dimension)`: calculates raw quantity conversions using direct inverse properties or by acting as a bridge through the primary base unit.
- `getPriceInUnit(basePricePerBaseUnit, targetUnit, dimension)`: figures out what the true price tag should be for a specific presentation or shopping cart quantity.
