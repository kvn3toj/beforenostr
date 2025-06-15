const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding users...');

  const users = [
    {
      email: 'admin@coomunity.co',
      name: 'Admin User',
      avatarUrl: null,
      isActive: true,
    },
    {
      email: 'user1@example.com',
      name: 'John Doe',
      avatarUrl: null,
      isActive: true,
    },
    {
      email: 'user2@example.com',
      name: 'Jane Smith',
      avatarUrl: null,
      isActive: true,
    },
    {
      email: 'user3@example.com',
      name: 'Bob Johnson',
      avatarUrl: null,
      isActive: false,
    },
  ];

  for (const userData of users) {
    try {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: userData,
        create: userData,
      });
      console.log(`✅ User created/updated: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
    }
  }

  console.log('🎉 Users seeding completed!');
}

seedUsers()
  .catch((e) => {
    console.error('❌ Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 