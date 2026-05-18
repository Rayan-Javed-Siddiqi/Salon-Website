const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.services.count();
  if (count > 0) {
    console.log('Services already seeded. Skipping.');
    return;
  }

  const services = [
    { serviceName: 'Haircut', durationMinutes: 30, price: 50 },
    { serviceName: 'Beard Trim', durationMinutes: 20, price: 30 },
    { serviceName: 'Haircut + Beard', durationMinutes: 45, price: 70 },
    { serviceName: 'Facial / Cleanup', durationMinutes: 40, price: 60 },
    { serviceName: 'Hair Coloring', durationMinutes: 75, price: 120 },
  ];

  console.log('Seeding database with services...');
  for (const s of services) {
    await prisma.services.create({ data: s });
  }
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
