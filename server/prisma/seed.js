const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@example.com';
    const password = 'adminpassword';
    
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    
    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name: 'Admin User',
                email: adminEmail,
                passwordHash,
                role: 'ADMIN'
            }
        });
        console.log('Admin user seeded successfully!');
    } else {
        console.log('Admin user already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
