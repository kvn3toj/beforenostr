require('dotenv').config();
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // Crear mundos de prueba
  const mundo1 = await prisma.mundo.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Mundo de Programación',
      description: 'Aprende programación desde cero',
      isActive: true,
    },
  });

  const mundo2 = await prisma.mundo.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'Mundo de Diseño',
      description: 'Diseño gráfico y UI/UX',
      isActive: true,
    },
  });

  // Crear playlists de prueba
  await prisma.playlist.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      mundoId: '1',
      name: 'Introducción a JavaScript',
      description: 'Conceptos básicos de JavaScript',
      orderInMundo: 1,
      isActive: true,
    },
  });

  await prisma.playlist.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      mundoId: '1',
      name: 'React Avanzado',
      description: 'Conceptos avanzados de React',
      orderInMundo: 2,
      isActive: true,
    },
  });

  await prisma.playlist.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      mundoId: '2',
      name: 'Principios de Diseño',
      description: 'Fundamentos del diseño gráfico',
      orderInMundo: 1,
      isActive: true,
    },
  });

  console.log('Datos de prueba creados exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 