import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

// Función para crear usuarios
async function createUsers(prisma: PrismaClient) {
  const usersData = [
    {
      email: 'admin@gamifier.com',
      password: await bcrypt.hash('admin123', 10),
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

    if (existingUser) {
      console.log(`Updating user: ${userData.email}`);
      await prisma.user.update({
        where: { email: userData.email },
        data: {
          password: userData.password,
          name: userData.name,
        },
      });

      // Check if user has an active stage progression
      const existingProgression = await prisma.stageProgression.findFirst({
        where: {
          userId: existingUser.id,
          isActive: true,
        },
      });

      // If no active progression, create one
      if (!existingProgression) {
        await prisma.stageProgression.create({
          data: {
            userId: existingUser.id,
            stage: userData.stage as any,
            isActive: true,
            requirements: {},
          },
        });
      }
    } else {
      console.log(`Creating user: ${userData.email}`);
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: userData.password,
          name: userData.name,
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
    }
  }
}
