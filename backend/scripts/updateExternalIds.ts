import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Rellena aquí los títulos y externalId que falten
const updates = [
  { title: 'The Game Changers', externalId: 'bHQqvYy5KYo' },
  { title: 'The Great Hack', externalId: 'Q5Aqk2G8r94' },
  // ...agrega aquí todos los que falten
];

async function main() {
  for (const { title, externalId } of updates) {
    const result = await prisma.videoItem.updateMany({
      where: { title },
      data: { externalId }
    });
    if (result.count > 0) {
      console.log(`✅ Actualizado: ${title} -> ${externalId}`);
    } else {
      console.warn(`⚠️ No se encontró video con título: ${title}`);
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
