import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@asara-lyon.fr' },
    update: { passwordHash: password },
    create: {
      email: 'admin@asara-lyon.fr',
      passwordHash: password,
      firstName: 'Admin',
      lastName: 'ASARA',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });
  
  console.log('Admin cree:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
