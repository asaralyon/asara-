import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Créer les catégories
  const categories = [
    { name: 'Sante', slug: 'sante', icon: 'Heart', order: 1 },
    { name: 'Juridique', slug: 'juridique', icon: 'Scale', order: 2 },
    { name: 'Restauration', slug: 'restauration', icon: 'UtensilsCrossed', order: 3 },
    { name: 'Commerce', slug: 'commerce', icon: 'Store', order: 4 },
    { name: 'Batiment', slug: 'batiment', icon: 'Building2', order: 5 },
    { name: 'Informatique', slug: 'informatique', icon: 'Laptop', order: 6 },
    { name: 'Education', slug: 'education', icon: 'GraduationCap', order: 7 },
    { name: 'Transport', slug: 'transport', icon: 'Car', order: 8 },
    { name: 'Beaute et Bien-etre', slug: 'beaute-bien-etre', icon: 'Sparkles', order: 9 },
    { name: 'Finance', slug: 'finance', icon: 'Landmark', order: 10 },
    { name: 'Immobilier', slug: 'immobilier', icon: 'Home', order: 11 },
    { name: 'Artisanat', slug: 'artisanat', icon: 'Hammer', order: 12 },
    { name: 'Autre', slug: 'autre', icon: 'MoreHorizontal', order: 99 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        order: cat.order,
        isActive: true,
      },
    });
    console.log('Category created:', cat.name);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });