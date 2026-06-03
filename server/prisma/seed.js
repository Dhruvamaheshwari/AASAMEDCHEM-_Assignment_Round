/** @format */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      passwordHash: hash,
      role: "ADMIN",
    },
  });

  console.log("Seed completed: Admin user created.");
  const conversions = [
    { fromUnit: "kg", toUnit: "g", factor: 1000, dimension: "weight" },
    { fromUnit: "mg", toUnit: "g", factor: 0.001, dimension: "weight" },
    { fromUnit: "lb", toUnit: "g", factor: 453.592, dimension: "weight" },
    { fromUnit: "oz", toUnit: "g", factor: 28.3495, dimension: "weight" },
    { fromUnit: "L", toUnit: "mL", factor: 1000, dimension: "volume" },
    { fromUnit: "dozen", toUnit: "unit", factor: 12, dimension: "count" },
  ];

  for (const conv of conversions) {
    const existing = await prisma.unitConversion.findFirst({
      where: { fromUnit: conv.fromUnit, toUnit: conv.toUnit },
    });
    if (!existing) {
      await prisma.unitConversion.create({ data: conv });
    }
  }

  console.log("Seed completed: Unit conversions created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
