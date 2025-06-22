import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('123456', 10);

  // 1. Create Roles if they don't exist
  const rolesToCreate = [
    { name: 'admin', description: 'Administrator role' },
    { name: 'user', description: 'Standard user role' },
    { name: 'premium', description: 'Premium user role' },
    { name: 'creator', description: 'Content creator role' },
    { name: 'moderator', description: 'Moderator role' },
  ];

  const createdRoles: { [key: string]: any } = {};
  for (const roleData of rolesToCreate) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
    createdRoles[role.name] = role;
  }

  // 2. Create users and link them to roles
  // Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gamifier.com' },
    update: {},
    create: {
      email: 'admin@gamifier.com',
      password: adminPassword,
      name: 'Admin User',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: adminUser.id, roleId: createdRoles['admin'].id },
    },
    update: {},
    create: { userId: adminUser.id, roleId: createdRoles['admin'].id },
  });

  // Regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@gamifier.com' },
    update: {},
    create: {
      email: 'user@gamifier.com',
      password: userPassword,
      name: 'Regular User',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: regularUser.id,
        roleId: createdRoles['user'].id,
      },
    },
    update: {},
    create: { userId: regularUser.id, roleId: createdRoles['user'].id },
  });

  // Premium user
  const premiumUser = await prisma.user.upsert({
    where: { email: 'premium@gamifier.com' },
    update: {},
    create: {
      email: 'premium@gamifier.com',
      password: userPassword,
      name: 'Premium User',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: premiumUser.id,
        roleId: createdRoles['premium'].id,
      },
    },
    update: {},
    create: { userId: premiumUser.id, roleId: createdRoles['premium'].id },
  });

  // Create content creator user
  const creatorUser = await prisma.user.upsert({
    where: { email: 'creator@gamifier.com' },
    update: {},
    create: {
      email: 'creator@gamifier.com',
      password: userPassword,
      name: 'Content Creator',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: creatorUser.id,
        roleId: createdRoles['creator'].id,
      },
    },
    update: {},
    create: { userId: creatorUser.id, roleId: createdRoles['creator'].id },
  });

  // Create moderator user
  const moderatorUser = await prisma.user.upsert({
    where: { email: 'moderator@gamifier.com' },
    update: {},
    create: {
      email: 'moderator@gamifier.com',
      password: userPassword,
      name: 'Moderator',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: moderatorUser.id,
        roleId: createdRoles['moderator'].id,
      },
    },
    update: {},
    create: { userId: moderatorUser.id, roleId: createdRoles['moderator'].id },
  });

  console.log('Development users seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
