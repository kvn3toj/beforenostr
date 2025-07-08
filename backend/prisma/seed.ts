import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

// Función para crear usuarios
async function createUsers(prisma: PrismaClient) {
  // 1. Sincronía de la Alquimia: Generar hash explícito para el admin
  const plainAdminPassword = 'admin123';
  const hashedAdminPassword = await bcrypt.hash(plainAdminPassword, 10);

  // 2. Ojo de HELIOS: Mostrar el hash generado para depuración
  console.log('🔮 HASH DEPURADO POR HELIOS:');
  console.log('Contraseña Plana:', plainAdminPassword);
  console.log('Hash Generado:', hashedAdminPassword);

  const usersData = [
    {
      email: 'admin@gamifier.com',
      password: hashedAdminPassword, // Usar el hash generado explícitamente
      name: 'Admin',
      roles: ['admin'],
      stage: 'PROMOTER',
    },
    {
      email: 'user@gamifier.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Usuario Regular',
      roles: ['user'],
      stage: 'SEEKER',
    },
    {
      email: 'premium@gamifier.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Usuario Premium',
      roles: ['user', 'premium'],
      stage: 'SOLVER',
    },
    {
      email: 'creator@gamifier.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Content Creator',
      roles: ['user', 'creator'],
      stage: 'SOLVER',
    },
    {
      email: 'moderator@gamifier.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Moderador',
      roles: ['user', 'moderator'],
      stage: 'PROMOTER',
    },
  ];

  for (const userData of usersData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      console.log(`Creating user: ${userData.email}`);
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          status: 'ACTIVE',
        },
      });

      // Create stage progression for the user
      await prisma.stageProgression.create({
        data: {
          userId: user.id,
          stage: userData.stage as any,
          isActive: true,
          requirements: {},
        },
      });

      // Assign roles
      for (const roleName of userData.roles) {
        const role = await prisma.role.findUnique({
          where: { name: roleName },
        });

        if (role) {
          await prisma.userRole.create({
            data: {
              userId: user.id,
              roleId: role.id,
            },
          });
        }
      }
    } else {
      console.log(`Updating user: ${userData.email}`);
      await prisma.user.update({
        where: { email: userData.email },
        data: {
          password: userData.password,
          name: userData.name,
          status: 'ACTIVE',
        },
      });
      // Opcional: podrías actualizar roles y stage progression aquí si lo deseas
    }
  }
}

// --- Ejecución principal del seed ---
async function main() {
  const prisma = new PrismaClient();
  await createUsers(prisma);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
