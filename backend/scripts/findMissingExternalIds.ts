import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.videoItem.findMany({
    where: {
      OR: [
        { externalId: null },
        { externalId: '' }
      ]
    },
    select: { id: true, title: true }
  });
  if (videos.length === 0) {
    console.log('✅ Todos los videos tienen externalId.');
  } else {
    console.log('❌ Videos sin externalId:');
    videos.forEach(v => console.log(`- ${v.title}`));
  }
}

main().finally(() => prisma.$disconnect());
