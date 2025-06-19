import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Generate prisma client from the local schema
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ========================================
  // STEP 1: Clean existing data (in correct order)
  // ========================================
  console.log('🧹 Cleaning existing data...');

  try {
    // Clean child entities first to avoid foreign key constraint violations
    await prisma.answerOption.deleteMany();
    console.log('  ✓ Deleted all answer options');

    await prisma.userAnswer.deleteMany();
    console.log('  ✓ Deleted all user answers');

    await prisma.activityQuestion.deleteMany();
    console.log('  ✓ Deleted all activity questions');

    await prisma.question.deleteMany();
    console.log('  ✓ Deleted all questions');

    await prisma.subtitle.deleteMany();
    console.log('  ✓ Deleted all subtitles');

    await prisma.videoPermissions.deleteMany();
    console.log('  ✓ Deleted all video permissions');

    await prisma.videoItem.deleteMany();
    console.log('  ✓ Deleted all video items');

    // Clean gamification entities
    await prisma.transaction.deleteMany();
    console.log('  ✓ Deleted all transactions');

    await prisma.wallet.deleteMany();
    console.log('  ✓ Deleted all wallets');

    await prisma.merit.deleteMany();
    console.log('  ✓ Deleted all merits');

    await prisma.token.deleteMany();
    console.log('  ✓ Deleted all tokens');

    await prisma.userInvitation.deleteMany();
    console.log('  ✓ Deleted all user invitations');

    await prisma.giftCard.deleteMany();
    console.log('  ✓ Deleted all gift cards');

    await prisma.invitationTemplate.deleteMany();
    console.log('  ✓ Deleted all invitation templates');

    await prisma.like.deleteMany();
    console.log('  ✓ Deleted all likes');

    await prisma.comment.deleteMany();
    console.log('  ✓ Deleted all comments');

    await prisma.publication.deleteMany();
    console.log('  ✓ Deleted all publications');

    await prisma.userGroup.deleteMany();
    console.log('  ✓ Deleted all user groups');

    await prisma.group.deleteMany();
    console.log('  ✓ Deleted all groups');

    await prisma.notification.deleteMany();
    console.log('  ✓ Deleted all notifications');

    await prisma.report.deleteMany();
    console.log('  ✓ Deleted all reports');

    await prisma.ranking.deleteMany();
    console.log('  ✓ Deleted all rankings');

    await prisma.analyticsData.deleteMany();
    console.log('  ✓ Deleted all analytics data');

    await prisma.log.deleteMany();
    console.log('  ✓ Deleted all logs');

    await prisma.configuration.deleteMany();
    console.log('  ✓ Deleted all configurations');

    await prisma.uIComponentTemplate.deleteMany();
    console.log('  ✓ Deleted all UI component templates');

    // Clean marketplace entities
    await prisma.marketplaceItem.deleteMany();
    console.log('  ✓ Deleted all marketplace items');

    // Clean challenge entities
    await prisma.userChallenge.deleteMany();
    console.log('  ✓ Deleted all user challenges');

    await prisma.challengeReward.deleteMany();
    console.log('  ✓ Deleted all challenge rewards');

    await prisma.challenge.deleteMany();
    console.log('  ✓ Deleted all challenges');

    // Clean content entities
    await prisma.contentItem.deleteMany();
    console.log('  ✓ Deleted all content items');

    await prisma.itemType.deleteMany();
    console.log('  ✓ Deleted all item types');

    await prisma.gamifiedPlaylist.deleteMany();
    console.log('  ✓ Deleted all gamified playlists');

    await prisma.activity.deleteMany();
    console.log('  ✓ Deleted all activities');

    await prisma.experience.deleteMany();
    console.log('  ✓ Deleted all experiences');

    await prisma.stage.deleteMany();
    console.log('  ✓ Deleted all stages');

    await prisma.world.deleteMany();
    console.log('  ✓ Deleted all worlds');

    await prisma.playlist.deleteMany();
    console.log('  ✓ Deleted all playlists');

    await prisma.mundo.deleteMany();
    console.log('  ✓ Deleted all mundos');

    // Clean user and role entities
    await prisma.userRole.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.personality.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Database cleaned successfully');
  } catch (error) {
    console.log('⚠️  Some tables might not exist yet, continuing with seeding...');
  }

  // ========================================
  // STEP 2: Create base data for existing entities
  // ========================================

  // Generate UUIDs for related entities
  const adminUserId = '00000000-0000-0000-0000-000000000001';
  const regularUserId = '00000000-0000-0000-0000-000000000002';
  const moderatorUserId = '00000000-0000-0000-0000-000000000003';
  const premiumUserId = '00000000-0000-0000-0000-000000000004';
  const contentCreatorUserId = '00000000-0000-0000-0000-000000000005';
  const testUserId1 = '00000000-0000-0000-0000-000000000006';
  const testUserId2 = '00000000-0000-0000-0000-000000000007';
  const testUserId3 = '00000000-0000-0000-0000-000000000008';
  const e2eTestUserId = '00000000-0000-0000-0000-000000000009';

  const mundo1Id = '11111111-1111-1111-1111-111111111111';
  const mundo2Id = '22222222-2222-2222-2222-222222222222';
  const mundo3Id = '33333333-3333-3333-3333-333333333333';

  const playlist1Id = '44444444-4444-4444-4444-444444444444';
  const playlist2Id = '55555555-5555-5555-5555-555555555555';
  const playlist3Id = '66666666-6666-6666-6666-666666666666';
  const playlist4Id = '77777777-7777-7777-7777-777777777777';

  // ========================================
  // STEP 2.1: Create Personalities
  // ========================================
  console.log('🎭 Creating personalities...');

  const personalities = await Promise.all([
    // Analistas (NT)
    prisma.personality.create({
      data: {
        name: 'INTJ',
        description: 'Arquitecto - Visionarios estratégicos con un plan para todo',
        traits: JSON.stringify({
          introversion: 85,
          intuition: 90,
          thinking: 85,
          judging: 80,
          creativity: 85,
          analytical: 95,
          independence: 90
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'INTP',
        description: 'Pensador - Innovadores flexibles con una sed insaciable de conocimiento',
        traits: JSON.stringify({
          introversion: 80,
          intuition: 95,
          thinking: 90,
          perceiving: 85,
          creativity: 95,
          analytical: 95,
          curiosity: 95
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ENTJ',
        description: 'Comandante - Líderes audaces e imaginativos',
        traits: JSON.stringify({
          extraversion: 85,
          intuition: 80,
          thinking: 85,
          judging: 90,
          leadership: 95,
          ambition: 90,
          strategic: 90
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ENTP',
        description: 'Innovador - Pensadores inteligentes y curiosos',
        traits: JSON.stringify({
          extraversion: 80,
          intuition: 90,
          thinking: 80,
          perceiving: 85,
          creativity: 95,
          adaptability: 90,
          enthusiasm: 85
        })
      }
    }),

    // Diplomáticos (NF)
    prisma.personality.create({
      data: {
        name: 'INFJ',
        description: 'Abogado - Idealistas creativos e inspiradores',
        traits: JSON.stringify({
          introversion: 85,
          intuition: 90,
          feeling: 85,
          judging: 80,
          empathy: 95,
          creativity: 85,
          idealism: 90
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'INFP',
        description: 'Mediador - Idealistas leales y siempre listos para defender sus valores',
        traits: JSON.stringify({
          introversion: 80,
          intuition: 85,
          feeling: 90,
          perceiving: 85,
          empathy: 90,
          creativity: 90,
          authenticity: 95
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ENFJ',
        description: 'Protagonista - Líderes carismáticos e inspiradores',
        traits: JSON.stringify({
          extraversion: 85,
          intuition: 80,
          feeling: 90,
          judging: 85,
          empathy: 95,
          leadership: 85,
          charisma: 90
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ENFP',
        description: 'Activista - Espíritus libres entusiastas y creativos',
        traits: JSON.stringify({
          extraversion: 90,
          intuition: 85,
          feeling: 85,
          perceiving: 90,
          enthusiasm: 95,
          creativity: 90,
          optimism: 90
        })
      }
    }),

    // Centinelas (SJ)
    prisma.personality.create({
      data: {
        name: 'ISTJ',
        description: 'Logista - Individuos prácticos y orientados a los hechos',
        traits: JSON.stringify({
          introversion: 80,
          sensing: 85,
          thinking: 80,
          judging: 90,
          reliability: 95,
          organization: 90,
          tradition: 85
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ISFJ',
        description: 'Protector - Protectores dedicados y cálidos',
        traits: JSON.stringify({
          introversion: 75,
          sensing: 80,
          feeling: 85,
          judging: 85,
          empathy: 90,
          loyalty: 95,
          service: 90
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ESTJ',
        description: 'Ejecutivo - Administradores excelentes e insuperables para gestionar cosas o personas',
        traits: JSON.stringify({
          extraversion: 85,
          sensing: 80,
          thinking: 85,
          judging: 90,
          leadership: 90,
          organization: 95,
          efficiency: 90
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ESFJ',
        description: 'Cónsul - Personas extraordinariamente cariñosas, sociales y populares',
        traits: JSON.stringify({
          extraversion: 85,
          sensing: 75,
          feeling: 90,
          judging: 80,
          empathy: 95,
          harmony: 90,
          cooperation: 95
        })
      }
    }),

    // Exploradores (SP)
    prisma.personality.create({
      data: {
        name: 'ISTP',
        description: 'Virtuoso - Experimentadores audaces y prácticos',
        traits: JSON.stringify({
          introversion: 80,
          sensing: 85,
          thinking: 85,
          perceiving: 90,
          practicality: 95,
          adaptability: 85,
          independence: 90
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ISFP',
        description: 'Aventurero - Artistas flexibles y encantadores',
        traits: JSON.stringify({
          introversion: 75,
          sensing: 80,
          feeling: 85,
          perceiving: 90,
          creativity: 90,
          sensitivity: 85,
          flexibility: 90
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ESTP',
        description: 'Emprendedor - Personas inteligentes, enérgicas y perceptivas',
        traits: JSON.stringify({
          extraversion: 90,
          sensing: 85,
          thinking: 80,
          perceiving: 85,
          energy: 95,
          adaptability: 90,
          pragmatism: 85
        })
      }
    }),
    prisma.personality.create({
      data: {
        name: 'ESFP',
        description: 'Animador - Personas espontáneas, enérgicas y entusiastas',
        traits: JSON.stringify({
          extraversion: 95,
          sensing: 80,
          feeling: 85,
          perceiving: 90,
          enthusiasm: 95,
          spontaneity: 90,
          optimism: 90
        })
      }
    })
  ]);

  console.log(`  ✓ Created ${personalities.length} personalities`);

  // ========================================
  // STEP 2.2: Create Users
  // ========================================
  console.log('👥 Creating users...');

  // Hash default passwords
  const defaultPassword = await bcrypt.hash('123456', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);
  const e2eTestPassword = await bcrypt.hash('test123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: adminUserId,
        email: 'admin@gamifier.com',
        username: 'admin',
        name: 'Administrator',
        firstName: 'Admin',
        lastName: 'System',
        password: adminPassword,
        avatarUrl: null,
        isActive: true,
        status: 'ACTIVE',
        personalityId: personalities[0].id,
        documentType: 'cedula',
        documentNumber: '1234567890',
        phone: '+1234567890',
        country: 'Colombia',
        address: 'Calle 123 #45-67'
      },
    }),

    prisma.user.create({
      data: {
        id: regularUserId,
        email: 'user@gamifier.com',
        username: 'regularuser',
        name: 'Regular User',
        firstName: 'John',
        lastName: 'Doe',
        password: defaultPassword,
        avatarUrl: null,
        isActive: true,
        status: 'ACTIVE',
        personalityId: personalities[1].id,
        documentType: 'passport',
        documentNumber: 'AB123456',
        phone: '+1234567891',
        country: 'USA',
        address: '123 Main St'
      },
    }),

    prisma.user.create({
      data: {
        id: moderatorUserId,
        email: 'moderator@gamifier.com',
        username: 'moderator',
        name: 'Moderator User',
        firstName: 'Jane',
        lastName: 'Smith',
        password: defaultPassword,
        avatarUrl: null,
        isActive: true,
        status: 'ACTIVE',
        personalityId: personalities[2].id,
        documentType: 'dni',
        documentNumber: '87654321',
        phone: '+1234567892',
        country: 'Spain',
        address: 'Plaza Mayor 1'
      },
    }),

    prisma.user.create({
      data: {
        id: premiumUserId,
        email: 'premium@gamifier.com',
        username: 'premiumuser',
        name: 'Premium User',
        firstName: 'Alice',
        lastName: 'Johnson',
        password: defaultPassword,
        avatarUrl: null,
        isActive: true,
        status: 'ACTIVE',
        topUserCount: 5,
        personalityId: personalities[0].id,
        documentType: 'cedula',
        documentNumber: '11223344',
        phone: '+1234567893',
        country: 'Mexico',
        address: 'Av. Reforma 222'
      },
    }),

    prisma.user.create({
      data: {
        id: contentCreatorUserId,
        email: 'creator@gamifier.com',
        username: 'contentcreator',
        name: 'Content Creator',
        firstName: 'Bob',
        lastName: 'Wilson',
        password: defaultPassword,
        avatarUrl: null,
        isActive: true,
        status: 'ACTIVE',
        topUserCount: 3,
        personalityId: personalities[0].id,
        documentType: 'passport',
        documentNumber: 'CD789012',
        phone: '+1234567894',
        country: 'Canada',
        address: '456 Maple Ave'
      },
    }),

    // Additional test users
    prisma.user.create({
      data: {
        id: testUserId1,
        email: 'test1@gamifier.com',
        username: 'testuser1',
        name: 'Test User 1',
        firstName: 'Test',
        lastName: 'One',
        password: defaultPassword,
        isActive: true,
        status: 'ACTIVE',
        personalityId: personalities[1].id
      },
    }),

    prisma.user.create({
      data: {
        id: testUserId2,
        email: 'test2@gamifier.com',
        username: 'testuser2',
        name: 'Test User 2',
        firstName: 'Test',
        lastName: 'Two',
        password: defaultPassword,
        isActive: true,
        status: 'INACTIVE',
        personalityId: personalities[2].id
      },
    }),

    prisma.user.create({
      data: {
        id: testUserId3,
        email: 'test3@gamifier.com',
        username: 'testuser3',
        name: 'Test User 3',
        firstName: 'Test',
        lastName: 'Three',
        password: defaultPassword,
        isActive: false,
        status: 'SUSPENDED',
        personalityId: personalities[0].id
      },
    }),

    // E2E Testing User - Utilizado por tests de Playwright
    prisma.user.create({
      data: {
        id: e2eTestUserId,
        email: 'test@coomunity.com',
        username: 'e2e_tester',
        name: 'E2E Test User',
        firstName: 'E2E',
        lastName: 'Tester',
        password: e2eTestPassword,
        avatarUrl: null,
        isActive: true,
        status: 'ACTIVE',
        personalityId: personalities[1].id,
        documentType: 'cedula',
        documentNumber: '9999999999',
        phone: '+1234567899',
        country: 'Colombia',
        address: 'Test Address 123'
      },
    }),
  ]);

  console.log(`  ✓ Created ${users.length} users with hashed passwords`);
  console.log('  🧪 E2E Test user created: test@coomunity.com / test123');

  // ========================================
  // STEP 2.3: Create Roles
  // ========================================
  console.log('🔐 Creating roles...');

  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: 'admin',
        description: 'Administrator with full system access',
      },
    }),
    prisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'Super administrator with highest privileges',
      },
    }),
    prisma.role.create({
      data: {
        name: 'USER',
        description: 'Regular user with limited access',
      },
    }),
    prisma.role.create({
      data: {
        name: 'MODERATOR',
        description: 'Moderator with content management access',
      },
    }),
    prisma.role.create({
      data: {
        name: 'BUYER',
        description: 'User who can purchase content and services',
      },
    }),
    prisma.role.create({
      data: {
        name: 'SEEKER',
        description: 'User seeking knowledge and experiences',
      },
    }),
    prisma.role.create({
      data: {
        name: 'SOLVER',
        description: 'User who solves challenges and creates solutions',
      },
    }),
    prisma.role.create({
      data: {
        name: 'PROMOTER',
        description: 'User who promotes content and invites others',
      },
    }),
    prisma.role.create({
      data: {
        name: 'PERFORMER',
        description: 'User who performs activities and completes challenges',
      },
    }),
    prisma.role.create({
      data: {
        name: 'SUPPORTER',
        description: 'User who supports others in the community',
      },
    }),
    prisma.role.create({
      data: {
        name: 'VALIDATOR',
        description: 'User who validates content and achievements',
      },
    }),
    prisma.role.create({
      data: {
        name: 'ARBITRATOR',
        description: 'User who resolves disputes and conflicts',
      },
    }),
    prisma.role.create({
      data: {
        name: 'GOVERNANCE_MEMBER',
        description: 'Member of the governance body',
      },
    }),
    prisma.role.create({
      data: {
        name: 'CONSCIOUS_CONSUMER',
        description: 'Conscious consumer focused on sustainable practices',
      },
    }),
    prisma.role.create({
      data: {
        name: 'ENTREPRENEUR',
        description: 'Entrepreneur creating value in the ecosystem',
      },
    }),
  ]);

  console.log(`  ✓ Created ${roles.length} roles`);

  // ========================================
  // STEP 2.4: Create Permissions
  // ========================================
  console.log('🔑 Creating permissions...');

  const permissions = await Promise.all([
    // Admin permissions
    prisma.permission.create({
      data: {
        name: 'admin:view_all',
        description: 'View all admin sections',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users:read',
        description: 'Read user information',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users:write',
        description: 'Create and update users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'users:delete',
        description: 'Delete users',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles:read',
        description: 'Read role information',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'roles:write',
        description: 'Create and update roles',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'content:read',
        description: 'Read content (mundos, playlists, videos)',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'content:write',
        description: 'Create and update content',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'content:delete',
        description: 'Delete content',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'analytics:read',
        description: 'View analytics and reports',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'gamification:manage',
        description: 'Manage gamification elements',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'wallet:manage',
        description: 'Manage wallet operations',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'groups:manage',
        description: 'Manage groups and communities',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'invitations:send',
        description: 'Send invitations and gift cards',
      },
    }),
  ]);

  console.log(`  ✓ Created ${permissions.length} permissions`);

  // ========================================
  // STEP 2.5: Assign Permissions to Roles
  // ========================================
  console.log('🔗 Assigning permissions to roles...');

  const adminRole = roles.find(r => r.name === 'admin')!;
  const superAdminRole = roles.find(r => r.name === 'SUPER_ADMIN')!;
  const userRole = roles.find(r => r.name === 'USER')!;
  const moderatorRole = roles.find(r => r.name === 'MODERATOR')!;

  // Super Admin gets all permissions
  await Promise.all(
    permissions.map(permission =>
      prisma.rolePermission.create({
        data: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
          assignedById: adminUserId,
        },
      })
    )
  );

  // Admin gets most permissions
  await Promise.all(
    permissions.filter(p => !p.name.includes('delete')).map(permission =>
      prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
          assignedById: adminUserId,
        },
      })
    )
  );

  // User role gets basic read permissions
  await Promise.all([
    prisma.rolePermission.create({
      data: {
        roleId: userRole.id,
        permissionId: permissions.find(p => p.name === 'content:read')!.id,
        assignedById: adminUserId,
      },
    }),
  ]);

  // Moderator role gets content management permissions
  const moderatorPermissions = ['content:read', 'content:write', 'users:read', 'analytics:read'];
  await Promise.all(
    permissions.filter(p => moderatorPermissions.includes(p.name)).map(permission =>
      prisma.rolePermission.create({
        data: {
          roleId: moderatorRole.id,
          permissionId: permission.id,
          assignedById: adminUserId,
        },
      })
    )
  );

  console.log('  ✓ Assigned permissions to roles');

  // ========================================
  // STEP 2.6: Assign Roles to Users
  // ========================================
  console.log('👤 Assigning roles to users...');

  await Promise.all([
    // Admin user gets ADMIN role
    prisma.userRole.create({
      data: {
        userId: adminUserId,
        roleId: adminRole.id,
        assignedById: adminUserId,
      },
    }),
    // Regular user gets USER role
    prisma.userRole.create({
      data: {
        userId: regularUserId,
        roleId: userRole.id,
        assignedById: adminUserId,
      },
    }),
    // Moderator user gets MODERATOR role
    prisma.userRole.create({
      data: {
        userId: moderatorUserId,
        roleId: moderatorRole.id,
        assignedById: adminUserId,
      },
    }),
    // Premium user gets multiple roles
    prisma.userRole.create({
      data: {
        userId: premiumUserId,
        roleId: userRole.id,
        assignedById: adminUserId,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: premiumUserId,
        roleId: roles.find(r => r.name === 'BUYER')!.id,
        assignedById: adminUserId,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: premiumUserId,
        roleId: roles.find(r => r.name === 'SOLVER')!.id,
        assignedById: adminUserId,
      },
    }),
    // Content creator gets creator roles
    prisma.userRole.create({
      data: {
        userId: contentCreatorUserId,
        roleId: userRole.id,
        assignedById: adminUserId,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: contentCreatorUserId,
        roleId: roles.find(r => r.name === 'PERFORMER')!.id,
        assignedById: adminUserId,
      },
    }),
    prisma.userRole.create({
      data: {
        userId: contentCreatorUserId,
        roleId: roles.find(r => r.name === 'PROMOTER')!.id,
        assignedById: adminUserId,
      },
    }),
    // E2E Test user gets USER role
    prisma.userRole.create({
      data: {
        userId: e2eTestUserId,
        roleId: userRole.id,
        assignedById: adminUserId,
      },
    }),
  ]);

  console.log('  ✓ Assigned roles to users');

  // ========================================
  // STEP 3: Create Mundos (Worlds)
  // ========================================
  console.log('🌍 Creating mundos...');

  const mundos = await Promise.all([
    prisma.mundo.create({
      data: {
        id: mundo1Id,
        name: 'Mundo de Gamificación Educativa',
        description: 'Un mundo dedicado al aprendizaje de gamificación en el ámbito educativo',
        imageUrl: 'https://example.com/images/gamification-world.jpg',
        isActive: true,
        createdById: adminUserId,
      },
    }),

    prisma.mundo.create({
      data: {
        id: mundo2Id,
        name: 'Mundo de Desarrollo Profesional',
        description: 'Espacio para el crecimiento y desarrollo de habilidades profesionales',
        imageUrl: 'https://example.com/images/professional-world.jpg',
        isActive: true,
        createdById: adminUserId,
      },
    }),

    prisma.mundo.create({
      data: {
        id: mundo3Id,
        name: 'Mundo de Innovación Social',
        description: 'Comunidad enfocada en crear soluciones innovadoras para problemas sociales',
        imageUrl: 'https://example.com/images/social-innovation-world.jpg',
        isActive: true,
        createdById: contentCreatorUserId,
      },
    }),
  ]);

  console.log(`  ✓ Created ${mundos.length} mundos`);

  // ========================================
  // STEP 4: Create Playlists
  // ========================================
  console.log('📂 Creating playlists...');

  const playlists = await Promise.all([
    prisma.playlist.create({
      data: {
        id: playlist1Id,
        mundoId: mundo1Id,
        name: 'Fundamentos de Gamificación',
        description: 'Serie introductoria sobre los conceptos básicos de gamificación',
        imageUrl: 'https://example.com/images/fundamentals-playlist.jpg',
        orderInMundo: 1,
        isActive: true,
        createdById: adminUserId,
      },
    }),

    prisma.playlist.create({
      data: {
        id: playlist2Id,
        mundoId: mundo1Id,
        name: 'Técnicas Avanzadas',
        description: 'Profundización en técnicas avanzadas de gamificación educativa',
        imageUrl: 'https://example.com/images/advanced-playlist.jpg',
        orderInMundo: 2,
        isActive: true,
        createdById: adminUserId,
      },
    }),

    prisma.playlist.create({
      data: {
        id: playlist3Id,
        mundoId: mundo2Id,
        name: 'Evaluación y Métricas',
        description: 'Cómo medir el éxito de la gamificación en educación',
        imageUrl: 'https://example.com/images/evaluation-playlist.jpg',
        orderInMundo: 1,
        isActive: true,
        createdById: contentCreatorUserId,
      },
    }),

    prisma.playlist.create({
      data: {
        id: playlist4Id,
        mundoId: mundo3Id,
        name: 'Casos de Éxito',
        description: 'Historias inspiradoras de innovación social',
        imageUrl: 'https://example.com/images/success-stories-playlist.jpg',
        orderInMundo: 1,
        isActive: true,
        createdById: contentCreatorUserId,
      },
    }),
  ]);

  console.log(`  ✓ Created ${playlists.length} playlists`);

  // ========================================
  // STEP 5: Create ItemTypes
  // ========================================
  console.log('📋 Creating item types...');

  const itemTypes = await Promise.all([
    prisma.itemType.create({
      data: {
        name: 'video',
        description: 'Video content type',
        isActive: true,
      },
    }),
    prisma.itemType.create({
      data: {
        name: 'article',
        description: 'Article content type',
        isActive: true,
      },
    }),
    prisma.itemType.create({
      data: {
        name: 'quiz',
        description: 'Quiz content type',
        isActive: true,
      },
    }),
    prisma.itemType.create({
      data: {
        name: 'assignment',
        description: 'Assignment content type',
        isActive: true,
      },
    }),
  ]);

  const videoItemType = itemTypes.find(it => it.name === 'video')!;
  const articleItemType = itemTypes.find(it => it.name === 'article')!;

  console.log(`  ✓ Created ${itemTypes.length} item types`);

  // ========================================
  // STEP 6: Create VideoItems with real YouTube videos
  // ========================================
  console.log('📹 Creating video items...');

  const videoItems = await Promise.all([
    prisma.videoItem.create({
      data: {
        title: 'Introducción a la Gamificación',
        description: 'Aprende los conceptos básicos de la gamificación y cómo aplicarlos en la educación.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube',
        externalId: 'dQw4w9WgXcQ',
        playlistId: playlist1Id,
        itemTypeId: videoItemType.id,
        order: 1,
        isActive: true,
        duration: 212, // 3:32
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        language: 'es',
        tags: JSON.stringify(['gamificación', 'educación', 'introducción']),
        categories: JSON.stringify(['Educación', 'Tecnología']),
      },
    }),

    prisma.videoItem.create({
      data: {
        title: 'Elementos de Juego en Educación',
        description: 'Descubre cómo los elementos de juego pueden transformar la experiencia educativa.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ScMzIvxBSi4" frameborder="0" allowfullscreen></iframe>',
        url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        platform: 'youtube',
        externalId: 'ScMzIvxBSi4',
        playlistId: playlist1Id,
        itemTypeId: videoItemType.id,
        order: 2,
        isActive: true,
        duration: 180, // 3:00
        thumbnailUrl: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
        language: 'es',
        tags: JSON.stringify(['elementos de juego', 'educación', 'motivación']),
        categories: JSON.stringify(['Educación']),
      },
    }),

    prisma.videoItem.create({
      data: {
        title: 'Mecánicas de Recompensa',
        description: 'Entiende cómo diseñar sistemas de recompensa efectivos que motiven a los estudiantes.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/9bZkp7q19f0" frameborder="0" allowfullscreen></iframe>',
        url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        platform: 'youtube',
        externalId: '9bZkp7q19f0',
        playlistId: playlist2Id,
        itemTypeId: videoItemType.id,
        order: 1,
        isActive: true,
        duration: 240, // 4:00
        thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        language: 'es',
        tags: JSON.stringify(['recompensas', 'motivación', 'gamificación']),
        categories: JSON.stringify(['Educación', 'Psicología']),
      },
    }),

    prisma.videoItem.create({
      data: {
        title: 'Narrativa y Storytelling',
        description: 'Aprende a crear narrativas envolventes que mantengan a los estudiantes comprometidos.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZXsQAXx_ao0" frameborder="0" allowfullscreen></iframe>',
        url: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
        platform: 'youtube',
        externalId: 'ZXsQAXx_ao0',
        playlistId: playlist2Id,
        itemTypeId: videoItemType.id,
        order: 2,
        isActive: true,
        duration: 300, // 5:00
        thumbnailUrl: 'https://img.youtube.com/vi/ZXsQAXx_ao0/maxresdefault.jpg',
        language: 'es',
        tags: JSON.stringify(['storytelling', 'narrativa', 'engagement']),
        categories: JSON.stringify(['Educación', 'Comunicación']),
      },
    }),

    prisma.videoItem.create({
      data: {
        title: 'Evaluación Gamificada',
        description: 'Descubre métodos innovadores para evaluar el progreso de los estudiantes a través del juego.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/kJQP7kiw5Fk" frameborder="0" allowfullscreen></iframe>',
        url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        platform: 'youtube',
        externalId: 'kJQP7kiw5Fk',
        playlistId: playlist3Id,
        itemTypeId: videoItemType.id,
        order: 1,
        isActive: true,
        duration: 270, // 4:30
        thumbnailUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
        language: 'es',
        tags: JSON.stringify(['evaluación', 'gamificación', 'métricas']),
        categories: JSON.stringify(['Educación', 'Evaluación']),
      },
    }),

    prisma.videoItem.create({
      data: {
        title: 'Caso de Estudio: Gamificación en Universidad',
        description: 'Análisis de un caso real de implementación de gamificación en educación superior.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/L_LUpnjgPso" frameborder="0" allowfullscreen></iframe>',
        url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
        platform: 'youtube',
        externalId: 'L_LUpnjgPso',
        playlistId: playlist3Id,
        itemTypeId: videoItemType.id,
        order: 2,
        isActive: false, // Inactive example
        duration: 360, // 6:00
        thumbnailUrl: 'https://img.youtube.com/vi/L_LUpnjgPso/maxresdefault.jpg',
        language: 'es',
        tags: JSON.stringify(['caso de estudio', 'universidad', 'implementación']),
        categories: JSON.stringify(['Educación Superior']),
      },
    }),
  ]);

  console.log(`  ✓ Created ${videoItems.length} video items`);

  // ========================================
  // STEP 7: Create Video Permissions
  // ========================================
  console.log('🔒 Creating video permissions...');

  await Promise.all(
    videoItems.map((video, index) =>
      prisma.videoPermissions.create({
        data: {
          videoItemId: video.id,
          showWaveCount: true,
          showVideos: true,
          showVideoSubtitles: true,
          showComments: index % 2 === 0, // Alternate
          showPublishDate: true,
          showVideoDuration: true,
          showLikeButton: true,
          allowRewindForward: index < 3, // First 3 videos allow rewind
          allowViewComments: true,
          allowMakeComments: index % 2 === 0,
          showLikeComments: true,
          sortCommentsByAffinity: index === 0,
          showCommenterName: index % 3 === 0,
          playlistPosition: index === 0 ? 'position1' : index === videoItems.length - 1 ? 'final' : 'position2',
          isDraft: false,
          createdById: adminUserId,
        },
      })
    )
  );

  console.log('  ✓ Created video permissions for all videos');

  // ========================================
  // STEP 7.5: Create Interactive Video Questions and Answer Options
  // ========================================
  console.log('❓ Creating interactive video questions...');

  const videoQuestions = [];

  // Questions for "Introducción a la Gamificación" (videoItems[0])
  const introGamificationQuestions = await Promise.all([
    prisma.question.create({
      data: {
        videoItemId: videoItems[0].id,
        timestamp: 30, // 30 seconds into the video
        type: 'MULTIPLE_CHOICE',
        text: '¿Cuál es el principal objetivo de la gamificación en educación?',
        languageCode: 'es',
        isActive: true,
      },
    }),
    prisma.question.create({
      data: {
        videoItemId: videoItems[0].id,
        timestamp: 90, // 1:30 into the video
        type: 'MULTIPLE_CHOICE',
        text: '¿Qué elemento NO es típico de la gamificación?',
        languageCode: 'es',
        isActive: true,
      },
    }),
    prisma.question.create({
      data: {
        videoItemId: videoItems[0].id,
        timestamp: 150, // 2:30 into the video
        type: 'TRUE_FALSE',
        text: 'La gamificación solo funciona con estudiantes jóvenes.',
        languageCode: 'es',
        isActive: true,
      },
    }),
  ]);
  videoQuestions.push(...introGamificationQuestions);

  // Answer options for "Introducción a la Gamificación" questions
  await Promise.all([
    // Question 1 options
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[0].id,
        text: 'Motivar y comprometer a los estudiantes',
        isCorrect: true,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[0].id,
        text: 'Hacer que los estudiantes jueguen más',
        isCorrect: false,
        order: 2,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[0].id,
        text: 'Reemplazar completamente la educación tradicional',
        isCorrect: false,
        order: 3,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[0].id,
        text: 'Eliminar la necesidad de profesores',
        isCorrect: false,
        order: 4,
      },
    }),

    // Question 2 options
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[1].id,
        text: 'Puntos y badges',
        isCorrect: false,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[1].id,
        text: 'Leaderboards',
        isCorrect: false,
        order: 2,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[1].id,
        text: 'Memorización pasiva',
        isCorrect: true,
        order: 3,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[1].id,
        text: 'Desafíos progresivos',
        isCorrect: false,
        order: 4,
      },
    }),

    // Question 3 options (True/False)
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[2].id,
        text: 'Verdadero',
        isCorrect: false,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: introGamificationQuestions[2].id,
        text: 'Falso',
        isCorrect: true,
        order: 2,
      },
    }),
  ]);

  // Questions for "Mecánicas de Recompensa" (videoItems[2])
  const rewardMechanicsQuestions = await Promise.all([
    prisma.question.create({
      data: {
        videoItemId: videoItems[2].id,
        timestamp: 45, // 45 seconds into the video
        type: 'MULTIPLE_CHOICE',
        text: '¿Cuál es el principio clave de las mecánicas de recompensa efectivas?',
        languageCode: 'es',
        isActive: true,
      },
    }),
    prisma.question.create({
      data: {
        videoItemId: videoItems[2].id,
        timestamp: 120, // 2:00 into the video
        type: 'MULTIPLE_CHOICE',
        text: '¿Qué tipo de recompensa es más sostenible a largo plazo?',
        languageCode: 'es',
        isActive: true,
      },
    }),
  ]);
  videoQuestions.push(...rewardMechanicsQuestions);

  // Answer options for "Mecánicas de Recompensa" questions
  await Promise.all([
    // Question 1 options
    prisma.answerOption.create({
      data: {
        questionId: rewardMechanicsQuestions[0].id,
        text: 'Dar recompensas constantemente',
        isCorrect: false,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: rewardMechanicsQuestions[0].id,
        text: 'Equilibrar esfuerzo y recompensa (Ayni)',
        isCorrect: true,
        order: 2,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: rewardMechanicsQuestions[0].id,
        text: 'Solo dar recompensas materiales',
        isCorrect: false,
        order: 3,
      },
    }),

    // Question 2 options
    prisma.answerOption.create({
      data: {
        questionId: rewardMechanicsQuestions[1].id,
        text: 'Recompensas monetarias',
        isCorrect: false,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: rewardMechanicsQuestions[1].id,
        text: 'Reconocimiento y crecimiento personal',
        isCorrect: true,
        order: 2,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: rewardMechanicsQuestions[1].id,
        text: 'Premios físicos',
        isCorrect: false,
        order: 3,
      },
    }),
  ]);

  // Questions for "Evaluación Gamificada" (videoItems[4])
  const gamifiedEvaluationQuestions = await Promise.all([
    prisma.question.create({
      data: {
        videoItemId: videoItems[4].id,
        timestamp: 60, // 1:00 into the video
        type: 'MULTIPLE_CHOICE',
        text: '¿Cuál es la ventaja principal de la evaluación gamificada?',
        languageCode: 'es',
        isActive: true,
      },
    }),
    prisma.question.create({
      data: {
        videoItemId: videoItems[4].id,
        timestamp: 180, // 3:00 into the video
        type: 'TRUE_FALSE',
        text: 'La evaluación gamificada elimina completamente el estrés de los exámenes.',
        languageCode: 'es',
        isActive: true,
      },
    }),
  ]);
  videoQuestions.push(...gamifiedEvaluationQuestions);

  // Answer options for "Evaluación Gamificada" questions
  await Promise.all([
    // Question 1 options
    prisma.answerOption.create({
      data: {
        questionId: gamifiedEvaluationQuestions[0].id,
        text: 'Hace que los exámenes sean más fáciles',
        isCorrect: false,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: gamifiedEvaluationQuestions[0].id,
        text: 'Proporciona feedback continuo y constructivo',
        isCorrect: true,
        order: 2,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: gamifiedEvaluationQuestions[0].id,
        text: 'Elimina la necesidad de estudiar',
        isCorrect: false,
        order: 3,
      },
    }),

    // Question 2 options (True/False)
    prisma.answerOption.create({
      data: {
        questionId: gamifiedEvaluationQuestions[1].id,
        text: 'Verdadero',
        isCorrect: false,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: gamifiedEvaluationQuestions[1].id,
        text: 'Falso',
        isCorrect: true,
        order: 2,
      },
    }),
  ]);

  console.log(`  ✓ Created ${videoQuestions.length} interactive video questions with their answer options`);

  // ========================================
  // STEP 8: Create Wallets
  // ========================================
  console.log('💰 Creating wallets...');

  const wallets = await Promise.all([
    prisma.wallet.create({
      data: {
        userId: adminUserId,
        blockchainAddress: '0x1234567890abcdef1234567890abcdef12345678',
        balanceUnits: 10000,
        balanceToins: 5000,
        status: 'ACTIVE',
      },
    }),
    prisma.wallet.create({
      data: {
        userId: regularUserId,
        blockchainAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        balanceUnits: 100,
        balanceToins: 50,
        status: 'ACTIVE',
      },
    }),
    prisma.wallet.create({
      data: {
        userId: premiumUserId,
        blockchainAddress: '0x9876543210fedcba9876543210fedcba98765432',
        balanceUnits: 5000,
        balanceToins: 2500,
        status: 'ACTIVE',
      },
    }),
    prisma.wallet.create({
      data: {
        userId: contentCreatorUserId,
        blockchainAddress: '0xfedcba9876543210fedcba9876543210fedcba98',
        balanceUnits: 3000,
        balanceToins: 1500,
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log(`  ✓ Created ${wallets.length} wallets`);

  // ========================================
  // STEP 9: Create Tokens
  // ========================================
  console.log('🪙 Creating tokens...');

  const tokens = await Promise.all([
    // Admin tokens
    prisma.token.create({
      data: {
        userId: adminUserId,
        amount: 5000,
        type: 'CIRCULATING_UNIT',
        status: 'ACTIVE',
        source: 'INITIAL_GRANT',
      },
    }),
    prisma.token.create({
      data: {
        userId: adminUserId,
        amount: 5000,
        type: 'TOIN',
        status: 'ACTIVE',
        source: 'INITIAL_GRANT',
      },
    }),

    // Regular user tokens
    prisma.token.create({
      data: {
        userId: regularUserId,
        amount: 100,
        type: 'PROMOTIONAL_UNIT',
        status: 'ACTIVE',
        caducityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        source: 'GIFT_CARD',
      },
    }),

    // Premium user tokens
    prisma.token.create({
      data: {
        userId: premiumUserId,
        amount: 2000,
        type: 'CIRCULATING_UNIT',
        status: 'ACTIVE',
        source: 'PURCHASE',
      },
    }),
    prisma.token.create({
      data: {
        userId: premiumUserId,
        amount: 500,
        type: 'SUBSCRIPTION_UNIT',
        status: 'ACTIVE',
        source: 'PURCHASE',
      },
    }),
    prisma.token.create({
      data: {
        userId: premiumUserId,
        amount: 2500,
        type: 'TOIN',
        status: 'ACTIVE',
        source: 'CONVERSION',
      },
    }),

    // Content creator tokens
    prisma.token.create({
      data: {
        userId: contentCreatorUserId,
        amount: 1500,
        type: 'CIRCULATING_UNIT',
        status: 'ACTIVE',
        source: 'REWARD',
      },
    }),
    prisma.token.create({
      data: {
        userId: contentCreatorUserId,
        amount: 1500,
        type: 'TOIN',
        status: 'ACTIVE',
        source: 'REWARD',
      },
    }),

    // Some expired tokens for testing
    prisma.token.create({
      data: {
        userId: testUserId1,
        amount: 50,
        type: 'PROMOTIONAL_UNIT',
        status: 'EXPIRED',
        caducityDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        source: 'GIFT_CARD',
      },
    }),
  ]);

  console.log(`  ✓ Created ${tokens.length} tokens`);

  // ========================================
  // STEP 10: Create Merits
  // ========================================
  console.log('🏆 Creating merits...');

  const merits = await Promise.all([
    // Admin merits
    prisma.merit.create({
      data: {
        userId: adminUserId,
        amount: 1000,
        type: 'MERITO',
        source: 'CONTENT_CREATION',
        relatedEntityId: mundo1Id,
      },
    }),
    prisma.merit.create({
      data: {
        userId: adminUserId,
        amount: 500,
        type: 'ONDA',
        source: 'COMMUNITY_PARTICIPATION',
      },
    }),

    // Premium user merits
    prisma.merit.create({
      data: {
        userId: premiumUserId,
        amount: 750,
        type: 'MERITO',
        source: 'CHALLENGE_COMPLETION',
      },
    }),
    prisma.merit.create({
      data: {
        userId: premiumUserId,
        amount: 300,
        type: 'VIBRA',
        source: 'INTERACTION',
      },
    }),
    prisma.merit.create({
      data: {
        userId: premiumUserId,
        amount: 200,
        type: 'ONDA',
        source: 'INVITATION_PERFORMANCE',
      },
    }),

    // Content creator merits
    prisma.merit.create({
      data: {
        userId: contentCreatorUserId,
        amount: 600,
        type: 'MERITO',
        source: 'CONTENT_CREATION',
        relatedEntityId: playlist3Id,
      },
    }),
    prisma.merit.create({
      data: {
        userId: contentCreatorUserId,
        amount: 400,
        type: 'VIBRA',
        source: 'COMMUNITY_PARTICIPATION',
      },
    }),

    // Regular user merits
    prisma.merit.create({
      data: {
        userId: regularUserId,
        amount: 100,
        type: 'ONDA',
        source: 'INTERACTION',
      },
    }),
  ]);

  console.log(`  ✓ Created ${merits.length} merits`);

  // ========================================
  // STEP 11: Create Transactions
  // ========================================
  console.log('💸 Creating transactions...');

  const transactions = await Promise.all([
    // Admin to regular user
    prisma.transaction.create({
      data: {
        fromUserId: adminUserId,
        toUserId: regularUserId,
        amount: 50,
        tokenType: 'CIRCULATING_UNIT',
        type: 'PAY',
        status: 'COMPLETED',
        description: 'Welcome bonus',
      },
    }),

    // Premium user purchases
    prisma.transaction.create({
      data: {
        fromUserId: null, // System transaction
        toUserId: premiumUserId,
        amount: 2000,
        tokenType: 'CIRCULATING_UNIT',
        type: 'RECHARGE',
        status: 'COMPLETED',
        description: 'Purchase of circulating units',
      },
    }),

    // Premium to content creator
    prisma.transaction.create({
      data: {
        fromUserId: premiumUserId,
        toUserId: contentCreatorUserId,
        amount: 100,
        tokenType: 'CIRCULATING_UNIT',
        type: 'PAY',
        status: 'COMPLETED',
        description: 'Payment for premium content',
      },
    }),

    // Token conversion
    prisma.transaction.create({
      data: {
        fromUserId: premiumUserId,
        toUserId: premiumUserId,
        amount: 500,
        tokenType: 'CIRCULATING_UNIT',
        type: 'CONVERT',
        status: 'COMPLETED',
        description: 'Convert units to TOINs',
      },
    }),

    // Failed transaction
    prisma.transaction.create({
      data: {
        fromUserId: regularUserId,
        toUserId: premiumUserId,
        amount: 1000,
        tokenType: 'CIRCULATING_UNIT',
        type: 'PAY',
        status: 'FAILED',
        description: 'Insufficient balance',
      },
    }),

    // Pending transaction
    prisma.transaction.create({
      data: {
        fromUserId: contentCreatorUserId,
        toUserId: adminUserId,
        amount: 250,
        tokenType: 'TOIN',
        type: 'EXCHANGE',
        status: 'PENDING',
        description: 'Exchange TOINs for services',
      },
    }),
  ]);

  console.log(`  ✓ Created ${transactions.length} transactions`);

  // ========================================
  // STEP 12: Create Groups
  // ========================================
  console.log('👥 Creating groups...');

  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: 'Innovadores Educativos',
        description: 'Grupo de educadores innovadores compartiendo mejores prácticas',
        ownerId: adminUserId,
        type: 'COMMUNITY_OF_PRACTICE',
      },
    }),
    prisma.group.create({
      data: {
        name: 'Clan Gamificadores',
        description: 'Clan exclusivo de expertos en gamificación',
        ownerId: premiumUserId,
        type: 'CLAN',
      },
    }),
    prisma.group.create({
      data: {
        name: 'Consejo de Gobierno',
        description: 'Órgano de gobierno de la plataforma',
        ownerId: adminUserId,
        type: 'GOVERNANCE_BODY',
      },
    }),
    prisma.group.create({
      data: {
        name: 'Amigos del Aprendizaje',
        description: 'Grupo informal de amigos aprendiendo juntos',
        ownerId: regularUserId,
        type: 'FRIEND',
      },
    }),
  ]);

  console.log(`  ✓ Created ${groups.length} groups`);

  // ========================================
  // STEP 13: Create UserGroups
  // ========================================
  console.log('🔗 Adding users to groups...');

  const userGroups = await Promise.all([
    // Innovadores Educativos members
    prisma.userGroup.create({
      data: {
        userId: adminUserId,
        groupId: groups[0].id,
        roleInGroup: 'LEADER',
      },
    }),
    prisma.userGroup.create({
      data: {
        userId: contentCreatorUserId,
        groupId: groups[0].id,
        roleInGroup: 'MEMBER',
      },
    }),
    prisma.userGroup.create({
      data: {
        userId: moderatorUserId,
        groupId: groups[0].id,
        roleInGroup: 'MODERATOR',
      },
    }),

    // Clan Gamificadores members
    prisma.userGroup.create({
      data: {
        userId: premiumUserId,
        groupId: groups[1].id,
        roleInGroup: 'LEADER',
      },
    }),
    prisma.userGroup.create({
      data: {
        userId: contentCreatorUserId,
        groupId: groups[1].id,
        roleInGroup: 'MEMBER',
      },
    }),

    // Consejo de Gobierno members
    prisma.userGroup.create({
      data: {
        userId: adminUserId,
        groupId: groups[2].id,
        roleInGroup: 'LEADER',
      },
    }),
    prisma.userGroup.create({
      data: {
        userId: premiumUserId,
        groupId: groups[2].id,
        roleInGroup: 'MEMBER',
      },
    }),
    prisma.userGroup.create({
      data: {
        userId: moderatorUserId,
        groupId: groups[2].id,
        roleInGroup: 'ARBITRATOR',
      },
    }),

    // Amigos del Aprendizaje members
    prisma.userGroup.create({
      data: {
        userId: regularUserId,
        groupId: groups[3].id,
        roleInGroup: 'LEADER',
      },
    }),
    prisma.userGroup.create({
      data: {
        userId: testUserId1,
        groupId: groups[3].id,
        roleInGroup: 'MEMBER',
      },
    }),
  ]);

  console.log(`  ✓ Added ${userGroups.length} users to groups`);

  // ========================================
  // STEP 14: Create Invitation Templates
  // ========================================
  console.log('💌 Creating invitation templates...');

  const invitationTemplates = await Promise.all([
    prisma.invitationTemplate.create({
      data: {
        name: 'Bienvenida Estándar',
        content: JSON.stringify({
          subject: 'Bienvenido a Gamifier',
          body: 'Te damos la bienvenida a nuestra comunidad de aprendizaje gamificado',
          imageUrl: 'https://example.com/welcome.jpg',
          buttonText: 'Comenzar Ahora',
        }),
        creatorId: adminUserId,
      },
    }),
    prisma.invitationTemplate.create({
      data: {
        name: 'Invitación Premium',
        content: JSON.stringify({
          subject: 'Invitación Exclusiva a Gamifier Premium',
          body: 'Has sido invitado a unirte como miembro premium con beneficios exclusivos',
          imageUrl: 'https://example.com/premium.jpg',
          buttonText: 'Activar Premium',
          benefits: ['Acceso ilimitado', 'Contenido exclusivo', 'Soporte prioritario'],
        }),
        creatorId: premiumUserId,
      },
    }),
  ]);

  console.log(`  ✓ Created ${invitationTemplates.length} invitation templates`);

  // ========================================
  // STEP 15: Create Gift Cards
  // ========================================
  console.log('🎁 Creating gift cards...');

  const giftCards = await Promise.all([
    prisma.giftCard.create({
      data: {
        inviterId: premiumUserId,
        invitedName: 'Juan Pérez',
        invitedEmail: 'juan.perez@example.com',
        token: 'GIFT-2024-PREMIUM-001',
        unitsAmount: 100,
        suggestions: JSON.stringify(['Curso de Gamificación', 'Taller de Innovación']),
        status: 'SENT',
      },
    }),
    prisma.giftCard.create({
      data: {
        inviterId: contentCreatorUserId,
        invitedName: 'María García',
        invitedEmail: 'maria.garcia@example.com',
        token: 'GIFT-2024-CREATOR-001',
        unitsAmount: 50,
        suggestions: JSON.stringify(['Introducción a Gamifier']),
        status: 'REDEEMED',
      },
    }),
    prisma.giftCard.create({
      data: {
        inviterId: adminUserId,
        invitedName: 'Carlos López',
        invitedEmail: 'carlos.lopez@example.com',
        token: 'GIFT-2024-ADMIN-001',
        unitsAmount: 200,
        status: 'EXPIRED',
      },
    }),
  ]);

  console.log(`  ✓ Created ${giftCards.length} gift cards`);

  // ========================================
  // STEP 16: Create Analytics Data
  // ========================================
  console.log('📊 Creating analytics data...');

  // Generate analytics data for the last 30 days
  const analyticsData: Promise<any>[] = [];
  const now = new Date();

  // Video view events
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random video views per day
    const viewsPerDay = Math.floor(Math.random() * 50) + 10;
    for (let j = 0; j < viewsPerDay; j++) {
      const randomVideo = videoItems[Math.floor(Math.random() * videoItems.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];

      analyticsData.push(
        prisma.analyticsData.create({
          data: {
            userId: randomUser.id,
            eventType: 'video_view',
            videoItemId: randomVideo.id.toString(),
            playlistId: randomVideo.playlistId,
            mundoId: playlists.find(p => p.id === randomVideo.playlistId)?.mundoId,
            sessionId: `session-${date.toISOString().split('T')[0]}-${j}`,
            eventData: JSON.stringify({
              duration: Math.floor(Math.random() * randomVideo.duration!),
              completed: Math.random() > 0.3,
            }),
            metadata: JSON.stringify({
              browser: 'Chrome',
              device: Math.random() > 0.5 ? 'desktop' : 'mobile',
            }),
            timestamp: date,
            createdAt: date,
          },
        })
      );
    }
  }

  // User creation events
  for (const user of users) {
    const creationDate = new Date(now);
    creationDate.setDate(creationDate.getDate() - Math.floor(Math.random() * 60)); // Random date in last 60 days

    analyticsData.push(
      prisma.analyticsData.create({
        data: {
          userId: user.id,
          eventType: 'user_created',
          eventData: JSON.stringify({
            source: 'organic',
            referrer: Math.random() > 0.5 ? 'google' : 'direct',
          }),
          timestamp: creationDate,
          createdAt: creationDate,
        },
      })
    );
  }

  // Playlist creation events
  for (const playlist of playlists) {
    const creationDate = new Date(now);
    creationDate.setDate(creationDate.getDate() - Math.floor(Math.random() * 45)); // Random date in last 45 days

    analyticsData.push(
      prisma.analyticsData.create({
        data: {
          userId: playlist.createdById || adminUserId,
          eventType: 'playlist_created',
          playlistId: playlist.id,
          mundoId: playlist.mundoId,
          timestamp: creationDate,
          createdAt: creationDate,
        },
      })
    );
  }

  // Mundo creation events
  for (const mundo of mundos) {
    const creationDate = new Date(now);
    creationDate.setDate(creationDate.getDate() - Math.floor(Math.random() * 50)); // Random date in last 50 days

    analyticsData.push(
      prisma.analyticsData.create({
        data: {
          userId: mundo.createdById || adminUserId,
          eventType: 'mundo_created',
          mundoId: mundo.id,
          timestamp: creationDate,
          createdAt: creationDate,
        },
      })
    );
  }

  await Promise.all(analyticsData);

  console.log(`  ✓ Created ${analyticsData.length} analytics events`);

  // ========================================
  // STEP 17: Create Marketplace Items (CoomÜnity GMP - Gamified Match Place)
  // ========================================
  console.log('🛒 Creating marketplace items...');

  const marketplaceItems = await Promise.all([
    // Service items from different users
    prisma.marketplaceItem.create({
      data: {
        name: 'Clases de Programación en JavaScript',
        description: 'Enseño JavaScript desde cero hasta nivel avanzado. Incluye proyectos prácticos y soporte personalizado.',
        itemType: 'SERVICE',
        price: 50,
        priceToins: 25,
        currency: 'LUKAS',
        status: 'ACTIVE',
        images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center'],
        tags: ['javascript', 'programación', 'educación', 'desarrollo web'],
        location: 'Online',
        sellerId: contentCreatorUserId,
        metadata: JSON.stringify({
          duration: '8 weeks',
          level: 'Beginner to Advanced',
          includes: ['Video lessons', 'Projects', '1-on-1 support'],
          languages: ['Español']
        }),
        isActive: true,
        isDeleted: false,
        viewCount: 45,
        favoriteCount: 12
      },
    }),

    prisma.marketplaceItem.create({
      data: {
        name: 'Diseño Gráfico Personalizado',
        description: 'Creo logos, identidad visual y material gráfico para tu marca o proyecto. Trabajo colaborativo basado en Ayni.',
        itemType: 'SERVICE',
        price: 75,
        priceToins: 30,
        currency: 'LUKAS',
        status: 'ACTIVE',
        images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop&crop=center', 'https://images.unsplash.com/photo-1558655146-9f40138eeb17?w=400&h=300&fit=crop&crop=center'],
        tags: ['diseño gráfico', 'logos', 'identidad visual', 'branding', 'ayni'],
        location: 'Medellín, Colombia',
        sellerId: premiumUserId,
        metadata: JSON.stringify({
          turnaround: '5-7 days',
          revisions: 3,
          deliverables: ['Logo files', 'Brand guidelines', 'Social media templates'],
          specialties: ['Sustainable design', 'Community-focused branding']
        }),
        isActive: true,
        isDeleted: false,
        viewCount: 32,
        favoriteCount: 8
      },
    }),

    // Product items
    prisma.marketplaceItem.create({
      data: {
        name: 'Curso Digital: Gamificación para Educadores',
        description: 'Curso completo sobre implementación de gamificación en entornos educativos. Basado en principios de CoomÜnity.',
        itemType: 'DIGITAL_CONTENT',
        price: 120,
        priceToins: 60,
        currency: 'LUKAS',
        status: 'ACTIVE',
        images: ['https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop&crop=center'],
        tags: ['gamificación', 'educación', 'curso digital', 'pedagogía', 'innovación'],
        location: 'Digital',
        sellerId: moderatorUserId,
        metadata: JSON.stringify({
          format: 'Video + PDF + Interactive exercises',
          duration: '12 hours',
          modules: 8,
          certificate: true,
          access: 'Lifetime',
          language: 'Español'
        }),
        isActive: true,
        isDeleted: false,
        viewCount: 67,
        favoriteCount: 18
      },
    }),

    prisma.marketplaceItem.create({
      data: {
        name: 'Plantas Medicinales Orgánicas',
        description: 'Vendo plantas medicinales cultivadas orgánicamente según principios de agricultura regenerativa.',
        itemType: 'PRODUCT',
        price: 25,
        priceToins: 10,
        currency: 'LUKAS',
        status: 'ACTIVE',
        images: ['https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=400&h=300&fit=crop&crop=center'],
        tags: ['plantas medicinales', 'orgánico', 'salud natural', 'agricultura regenerativa'],
        location: 'Bogotá, Colombia',
        sellerId: testUserId1,
        metadata: JSON.stringify({
          varieties: ['Hierbabuena', 'Manzanilla', 'Caléndula', 'Romero'],
          cultivation: 'Organic certified',
          shipping: 'Local delivery available',
          care_instructions: 'Included'
        }),
        isActive: true,
        isDeleted: false,
        viewCount: 23,
        favoriteCount: 5
      },
    }),

    // Experience items
    prisma.marketplaceItem.create({
      data: {
        name: 'Retiro de Mindfulness y Tecnología Consciente',
        description: 'Experiencia de 3 días combinando mindfulness con el uso consciente de la tecnología. Perfecta para desarrolladores y creadores.',
        itemType: 'EXPERIENCE',
        price: 200,
        priceToins: 100,
        currency: 'LUKAS',
        status: 'ACTIVE',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center'],
        tags: ['mindfulness', 'tecnología consciente', 'retiro', 'bienestar', 'desarrolladores'],
        location: 'Villa de Leyva, Colombia',
        sellerId: regularUserId,
        metadata: JSON.stringify({
          duration: '3 days, 2 nights',
          includes: ['Accommodation', 'All meals', 'Guided sessions', 'Digital detox kit'],
          max_participants: 12,
          next_dates: ['2025-02-15', '2025-03-15', '2025-04-15'],
          prerequisites: 'Open mind and willingness to disconnect'
        }),
        isActive: true,
        isDeleted: false,
        viewCount: 41,
        favoriteCount: 15
      },
    }),

    // Skill exchange
    prisma.marketplaceItem.create({
      data: {
        name: 'Intercambio: Programación por Marketing Digital',
        description: 'Ofrezco enseñar programación en Python a cambio de aprender estrategias de marketing digital. Intercambio basado en Ayni.',
        itemType: 'SKILL_EXCHANGE',
        price: 0, // Skill exchange, no monetary cost
        priceToins: 0,
        currency: 'LUKAS',
        status: 'ACTIVE',
        images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=center'],
        tags: ['intercambio de habilidades', 'python', 'marketing digital', 'ayni', 'colaboración'],
        location: 'Online',
        sellerId: testUserId2,
        metadata: JSON.stringify({
          offering: {
            skill: 'Python Programming',
            level: 'Intermediate to Advanced',
            time_commitment: '2 hours per week'
          },
          seeking: {
            skill: 'Digital Marketing',
            level: 'Beginner to Intermediate',
            focus: ['Social media', 'Content strategy', 'SEO basics']
          },
          duration: '8 weeks',
          format: 'Video calls + shared projects'
        }),
        isActive: true,
        isDeleted: false,
        viewCount: 19,
        favoriteCount: 7
      },
    }),

    // Draft item (not visible in public listings)
    prisma.marketplaceItem.create({
      data: {
        name: 'Consultoría en Sostenibilidad Empresarial',
        description: 'Servicio de consultoría para implementar prácticas sostenibles en empresas medianas.',
        itemType: 'SERVICE',
        price: 300,
        priceToins: 150,
        currency: 'LUKAS',
        status: 'DRAFT', // Not yet published
        images: [],
        tags: ['consultoría', 'sostenibilidad', 'empresas', 'responsabilidad social'],
        location: 'Colombia',
        sellerId: premiumUserId,
        metadata: JSON.stringify({
          status: 'in_development',
          launch_date: '2025-02-01'
        }),
        isActive: true,
        isDeleted: false,
        viewCount: 0,
        favoriteCount: 0
      },
    }),

    // Sold item (for historical data)
    prisma.marketplaceItem.create({
      data: {
        name: 'Workshop: Introducción a la Economía Colaborativa',
        description: 'Workshop presencial sobre los principios y práctica de la economía colaborativa.',
        itemType: 'EXPERIENCE',
        price: 80,
        priceToins: 40,
        currency: 'LUKAS',
        status: 'SOLD',
        images: ['https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop&crop=center'],
        tags: ['economía colaborativa', 'workshop', 'presencial', 'educación'],
        location: 'Medellín, Colombia',
        sellerId: contentCreatorUserId,
        metadata: JSON.stringify({
          sold_date: '2024-12-20',
          buyer_feedback: 'Excellent workshop, very practical insights',
          completion_date: '2024-12-22'
        }),
        isActive: false,
        isDeleted: false,
        viewCount: 89,
        favoriteCount: 22
      },
    }),
  ]);

  console.log(`  ✓ Created ${marketplaceItems.length} marketplace items`);
  console.log('    - Services: 2');
  console.log('    - Digital Content: 1');
  console.log('    - Products: 1');
  console.log('    - Experiences: 2');
  console.log('    - Skill Exchanges: 1');
  console.log('    - Draft items: 1');
  console.log('    - Sold items: 1');

  // ========================================

  // ========================================
  // STEP 18: Create CoomÜnity Entities (Worlds, Stages, Experiences, Activities)
  // ========================================
  console.log('🌐 Creating CoomÜnity worlds...');

  const worlds = await Promise.all([
    prisma.world.create({
      data: {
        name: 'ONE',
        description: 'Mundo individual para desarrollo personal',
        type: 'TRANSITORIO',
        creatorId: adminUserId,
        status: 'ACTIVE',
        mundoId: mundo1Id,
      },
    }),
    prisma.world.create({
      data: {
        name: 'DUO',
        description: 'Mundo de parejas para colaboración dual',
        type: 'TRANSITORIO',
        creatorId: premiumUserId,
        status: 'ACTIVE',
        mundoId: mundo2Id,
      },
    }),
    prisma.world.create({
      data: {
        name: 'TRIKETA',
        description: 'Mundo de triadas para dinámicas grupales',
        type: 'MEDIANA_DURACION',
        creatorId: contentCreatorUserId,
        status: 'ACTIVE',
        mundoId: mundo3Id,
      },
    }),
  ]);

  console.log(`  ✓ Created ${worlds.length} CoomÜnity worlds`);

  // Create stages for each world
  console.log('📍 Creating stages...');

  const stageNames = ['BUYER', 'SEEKER', 'SOLVER', 'PROMOTER', 'PERFORMER', 'SUPPORTER', 'VALIDATOR'];
  const stages: any[] = [];

  for (const world of worlds) {
    for (let i = 0; i < stageNames.length; i++) {
      const stage = await prisma.stage.create({
        data: {
          worldId: world.id,
          name: stageNames[i],
          order: i + 1,
          description: `Etapa ${stageNames[i]} en el mundo ${world.name}`,
        },
      });
      stages.push(stage);
    }
  }

  console.log(`  ✓ Created ${stages.length} stages`);

  // Create experiences for some stages
  console.log('🎯 Creating experiences...');

  const experiences = await Promise.all([
    prisma.experience.create({
      data: {
        stageId: stages[0].id,
        title: 'Experiencia de Comprador Gamificado',
        description: 'Aprende a ser un comprador consciente',
        type: 'GAMIFIED_CLIENT',
        gamificationFramework: 'Octalysis',
        creatorId: adminUserId,
      },
    }),
    prisma.experience.create({
      data: {
        stageId: stages[2].id,
        title: 'Experiencia de Solucionador',
        description: 'Desarrolla habilidades para resolver problemas complejos',
        type: 'GAMIFIED_SOLVER',
        gamificationFramework: 'Octalysis',
        creatorId: contentCreatorUserId,
      },
    }),
    prisma.experience.create({
      data: {
        stageId: stages[4].id,
        title: 'Experiencia de Performer',
        description: 'Mejora tu desempeño y productividad',
        type: 'REFORMATORY',
        gamificationFramework: 'Octalysis',
        creatorId: premiumUserId,
      },
    }),
  ]);

  console.log(`  ✓ Created ${experiences.length} experiences`);

  // Create activities for experiences
  console.log('🎮 Creating activities...');

  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        experienceId: experiences[0].id,
        title: 'Video: Introducción al Consumo Consciente',
        description: 'Aprende los principios del consumo consciente',
        type: 'VIDEO',
        multimediaType: 'AUDIOVISUAL',
        contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 300,
        order: 1,
        status: 'ACTIVE',
        creatorId: adminUserId,
        videoItemId: videoItems[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        experienceId: experiences[1].id,
        title: 'Cuestionario: Evalúa tu Capacidad de Resolución',
        description: 'Test para medir tus habilidades actuales',
        type: 'QUESTIONNAIRE',
        order: 1,
        status: 'ACTIVE',
        creatorId: contentCreatorUserId,
      },
    }),
    prisma.activity.create({
      data: {
        experienceId: experiences[2].id,
        title: 'Audio: Meditación para el Alto Rendimiento',
        description: 'Sesión de meditación guiada',
        type: 'AUDIO',
        multimediaType: 'AUDIO',
        contentUrl: 'https://example.com/meditation.mp3',
        duration: 600,
        order: 1,
        status: 'ACTIVE',
        creatorId: premiumUserId,
      },
    }),
  ]);

  console.log(`  ✓ Created ${activities.length} activities`);

  // Create activity questions
  console.log('❔ Creating activity questions...');

  const activityQuestions = await Promise.all([
    prisma.activityQuestion.create({
      data: {
        activityId: activities[1].id,
        type: 'SYNCHRONOUS',
        questionType: 'MULTIPLE_CHOICE',
        questionText: '¿Cuál es tu enfoque principal al resolver problemas?',
        options: JSON.stringify([
          'Análisis detallado',
          'Intuición',
          'Colaboración',
          'Experimentación'
        ]),
        correctAnswer: JSON.stringify(0),
        ondasList: JSON.stringify([10, 5, 5, 8]),
        displayTimeSeconds: 30,
      },
    }),
    prisma.activityQuestion.create({
      data: {
        activityId: activities[1].id,
        type: 'ASYNCHRONOUS',
        questionType: 'SLIDER',
        questionText: '¿Qué tan cómodo te sientes tomando decisiones bajo presión?',
        options: JSON.stringify({ min: 0, max: 100, step: 10 }),
        ondasList: JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      },
    }),
  ]);

  console.log(`  ✓ Created ${activityQuestions.length} activity questions`);

  // ========================================
  // STEP 19: Create Additional Data
  // ========================================

  // Create some publications
  console.log('📢 Creating publications...');

  const publications = await Promise.all([
    prisma.publication.create({
      data: {
        userId: contentCreatorUserId,
        content: '¡Acabo de completar el nuevo curso de gamificación! Muy recomendado 🎮',
        type: 'TEXT',
      },
    }),
    prisma.publication.create({
      data: {
        userId: premiumUserId,
        content: 'Compartiendo mi experiencia con la plataforma Gamifier',
        type: 'TEXT',
      },
    }),
  ]);

  console.log(`  ✓ Created ${publications.length} publications`);

  // Create some comments
  console.log('💬 Creating comments...');

  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        userId: regularUserId,
        publicationId: publications[0].id,
        text: '¡Felicidades! ¿Qué fue lo que más te gustó?',
      },
    }),
    prisma.comment.create({
      data: {
        userId: adminUserId,
        publicationId: publications[0].id,
        text: 'Gracias por compartir tu experiencia 👏',
      },
    }),
  ]);

  console.log(`  ✓ Created ${comments.length} comments`);

  // Create likes for publications
  console.log('❤️ Creating likes...');

  const likes = await Promise.all([
    // Likes on first publication (content creator's gamification course)
    prisma.like.create({
      data: {
        userId: adminUserId,
        publicationId: publications[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: regularUserId,
        publicationId: publications[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: premiumUserId,
        publicationId: publications[0].id,
      },
    }),

    // Likes on second publication (premium user's experience)
    prisma.like.create({
      data: {
        userId: adminUserId,
        publicationId: publications[1].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: contentCreatorUserId,
        publicationId: publications[1].id,
      },
    }),
  ]);

  console.log(`  ✓ Created ${likes.length} likes`);

  // Create notifications
  console.log('🔔 Creating notifications...');

  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: regularUserId,
        type: 'MERIT_AWARDED',
        message: 'Has recibido 100 Öndas por tu participación',
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: premiumUserId,
        type: 'TRANSACTION_COMPLETED',
        message: 'Tu transacción de 100 unidades ha sido completada',
        read: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: contentCreatorUserId,
        type: 'NEW_PUBLICATION',
        message: 'Alguien comentó en tu publicación',
        read: false,
      },
    }),
  ]);

  console.log(`  ✓ Created ${notifications.length} notifications`);

  // Create rankings
  console.log('🏅 Creating rankings...');

  const rankings = await Promise.all([
    prisma.ranking.create({
      data: {
        name: 'Top Méritos - Semana Actual',
        type: 'MERITS',
        period: 'WEEKLY',
        data: JSON.stringify([
          { userId: adminUserId, position: 1, amount: 1500 },
          { userId: premiumUserId, position: 2, amount: 1250 },
          { userId: contentCreatorUserId, position: 3, amount: 1000 },
        ]),
      },
    }),
    prisma.ranking.create({
      data: {
        name: 'Usuarios Más Activos - Mes',
        type: 'ACTIVITY_COMPLETION',
        period: 'MONTHLY',
        data: JSON.stringify([
          { userId: premiumUserId, position: 1, completions: 45 },
          { userId: contentCreatorUserId, position: 2, completions: 38 },
          { userId: regularUserId, position: 3, completions: 22 },
        ]),
      },
    }),
  ]);

  console.log(`  ✓ Created ${rankings.length} rankings`);

  // Create configurations
  console.log('⚙️ Creating configurations...');

  const configurations = await Promise.all([
    prisma.configuration.create({
      data: {
        key: 'gamification.points_per_video',
        value: JSON.stringify({ amount: 10, currency: 'ONDA' }),
        type: 'GAMIFICATION_PARAM',
      },
    }),
    prisma.configuration.create({
      data: {
        key: 'system.maintenance_mode',
        value: JSON.stringify({ enabled: false, message: '' }),
        type: 'SYSTEM',
      },
    }),
    prisma.configuration.create({
      data: {
        key: 'feature.ai_questions',
        value: JSON.stringify({ enabled: true, model: 'gpt-4' }),
        type: 'FEATURE',
      },
    }),
  ]);

  console.log(`  ✓ Created ${configurations.length} configurations`);

  // ========================================
  // STEP 3: Create Challenges (Desafíos) with CoomÜnity Philosophy
  // ========================================
  console.log('🏆 Creating challenges aligned with CoomÜnity philosophy...');

  // Define challenge data with CoomÜnity concepts
  const challengesToCreate = [
    {
      title: 'Iniciación al Ayni',
      description: 'Completa 3 actos de reciprocidad en la comunidad esta semana. El Ayni es el principio fundamental de dar y recibir en equilibrio, creando un flujo de valor que beneficia a toda la CoomÜnity.',
      type: 'AUTOMATED',
      status: 'ACTIVE',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-03-01'),
      config: JSON.stringify({
        target: 3,
        actions: ['help_member', 'share_knowledge', 'mentor_newcomer'],
        difficulty: 'BEGINNER'
      }),
    },
    {
      title: 'Maestría en Colaboración',
      description: 'Participa y contribuye activamente en 2 proyectos de grupo diferentes. La colaboración consciente es clave para construir el Bien Común a través de la sinergia colectiva.',
      type: 'AUTOMATED',
      status: 'ACTIVE',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-06-01'),
      config: JSON.stringify({
        target: 2,
        actions: ['join_group_project', 'contribute_ideas', 'complete_tasks'],
        difficulty: 'INTERMEDIATE'
      }),
    },
    {
      title: 'Innovación para el Bien Común',
      description: 'Propón una nueva idea o mejora para la plataforma que beneficie a toda la comunidad. Tu vocación creativa puede generar valor para todos.',
      type: 'CUSTOM',
      status: 'ACTIVE',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-12-01'),
      config: JSON.stringify({
        target: 1,
        submission_type: 'proposal',
        evaluation_criteria: ['innovation', 'impact', 'feasibility'],
        difficulty: 'ADVANCED'
      }),
    },
    {
      title: 'Guía de Metanöia',
      description: 'Ayuda a 5 nuevos miembros en su proceso de transformación y despertar en CoomÜnity. La Metanöia es el cambio consciente que lleva a una nueva perspectiva de vida.',
      type: 'AUTOMATED',
      status: 'ACTIVE',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-09-01'),
      config: JSON.stringify({
        target: 5,
        actions: ['guide_onboarding', 'answer_questions', 'share_experience'],
        difficulty: 'INTERMEDIATE'
      }),
    },
    {
      title: 'Emprendedor Confiable',
      description: 'Acumula 1000 Mëritos demostrando consistencia en tus contribuciones al ecosistema. Los Emprendedores Confiables son pilares de la comunidad.',
      type: 'AUTOMATED',
      status: 'ACTIVE',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2026-01-01'),
      config: JSON.stringify({
        target: 1000,
        metric: 'merits',
        tracking: 'cumulative',
        difficulty: 'ADVANCED'
      }),
    },
    {
      title: 'Ritual de Neguentropía',
      description: 'Participa en actividades que generen orden y armonía en lugar de caos. Contribuye a crear una experiencia más organizada y positiva.',
      type: 'CUSTOM',
      status: 'INACTIVE', // Un desafío inactivo para testing
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      config: JSON.stringify({
        focus: 'organization',
        activities: ['cleanup_spaces', 'organize_content', 'moderate_discussions'],
        difficulty: 'INTERMEDIATE'
      }),
    },
  ];

  // Create challenges using simple create (seed script cleans data first, so no duplicates)
  const challenges = await Promise.all(
    challengesToCreate.map(challengeData =>
      prisma.challenge.create({ data: challengeData })
    )
  );

  console.log(`  ✓ Created ${challenges.length} challenges`);

  // ========================================
  // STEP 3.1: Create Challenge Rewards
  // ========================================
  console.log('🎁 Creating challenge rewards...');

  const challengeRewards = [];

  // Rewards for "Iniciación al Ayni"
  const ayniRewards = await Promise.all([
    prisma.challengeReward.create({
      data: {
        challengeId: challenges[0].id,
        type: 'MERITS',
        amount: 150,
        description: '150 Mëritos por completar tu iniciación al Ayni',
        metadata: JSON.stringify({ category: 'BEGINNER_ACHIEVEMENT' }),
      },
    }),
    prisma.challengeReward.create({
      data: {
        challengeId: challenges[0].id,
        type: 'BADGE',
        description: 'Insignia de Iniciado en Ayni',
        metadata: JSON.stringify({
          badge_name: 'Ayni Novice',
          icon: 'ayni-symbol',
          rarity: 'COMMON'
        }),
      },
    }),
  ]);
  challengeRewards.push(...ayniRewards);

  // Rewards for "Maestría en Colaboración"
  const collaborationRewards = await Promise.all([
    prisma.challengeReward.create({
      data: {
        challengeId: challenges[1].id,
        type: 'MERITS',
        amount: 250,
        description: '250 Mëritos por demostrar maestría colaborativa',
      },
    }),
    prisma.challengeReward.create({
      data: {
        challengeId: challenges[1].id,
        type: 'UNITS',
        amount: 50,
        description: '50 Ünits de colaboración',
        metadata: JSON.stringify({ unit_type: 'COLLABORATION_UNITS' }),
      },
    }),
  ]);
  challengeRewards.push(...collaborationRewards);

  // Rewards for "Innovación para el Bien Común"
  const innovationReward = await prisma.challengeReward.create({
    data: {
      challengeId: challenges[2].id,
      type: 'MERITS',
      amount: 500,
      description: '500 Mëritos por innovar para el Bien Común',
      metadata: JSON.stringify({
        category: 'INNOVATION_REWARD',
        recognition: 'COMMUNITY_IMPACT'
      }),
    },
  });
  challengeRewards.push(innovationReward);

  // Rewards for "Guía de Metanöia"
  const metanoiaReward = await prisma.challengeReward.create({
    data: {
      challengeId: challenges[3].id,
      type: 'MERITS',
      amount: 300,
      description: '300 Mëritos por guiar procesos de Metanöia',
      metadata: JSON.stringify({
        category: 'MENTORSHIP_REWARD',
        impact: 'TRANSFORMATION_GUIDE'
      }),
    },
  });
  challengeRewards.push(metanoiaReward);

  // Rewards for "Emprendedor Confiable"
  const entrepreneurRewards = await Promise.all([
    prisma.challengeReward.create({
      data: {
        challengeId: challenges[4].id,
        type: 'BADGE',
        description: 'Título de Emprendedor Confiable',
        metadata: JSON.stringify({
          badge_name: 'Trusted Entrepreneur',
          icon: 'trust-seal',
          rarity: 'EPIC',
          special_privileges: ['priority_support', 'advanced_features']
        }),
      },
    }),
    prisma.challengeReward.create({
      data: {
        challengeId: challenges[4].id,
        type: 'TOKENS',
        amount: 100,
        description: '100 Lükas como reconocimiento de confiabilidad',
        metadata: JSON.stringify({ token_type: 'LUKAS' }),
      },
    }),
  ]);
  challengeRewards.push(...entrepreneurRewards);

  // Rewards for "Ritual de Neguentropía" (inactive challenge)
  const neguentropyReward = await prisma.challengeReward.create({
    data: {
      challengeId: challenges[5].id,
      type: 'MERITS',
      amount: 200,
      description: '200 Mëritos por contribuir al orden y armonía',
      metadata: JSON.stringify({
        category: 'ORGANIZATION_REWARD',
        impact: 'HARMONY_BUILDER'
      }),
    },
  });
  challengeRewards.push(neguentropyReward);

  console.log(`  ✓ Created ${challengeRewards.length} challenge rewards`);

  // ========================================
  // STEP 3.2: Create User Challenges (Sample participations)
  // ========================================
  console.log('👥 Creating user challenge participations...');

  const userChallenges = await Promise.all([
    // Regular user participates in Ayni challenge (in progress)
    prisma.userChallenge.create({
      data: {
        userId: regularUserId,
        challengeId: challenges[0].id, // Iniciación al Ayni
        status: 'ACTIVE',
        progress: 66.67, // 2 out of 3 acts completed
        metadata: JSON.stringify({
          completed_acts: 2,
          target_acts: 3,
          acts_completed: ['help_member', 'share_knowledge']
        }),
      },
    }),

    // Premium user completed Ayni and is working on Collaboration
    prisma.userChallenge.create({
      data: {
        userId: premiumUserId,
        challengeId: challenges[0].id, // Iniciación al Ayni
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date('2024-12-15'),
        metadata: JSON.stringify({
          completed_acts: 3,
          target_acts: 3,
          completion_date: '2024-12-15'
        }),
      },
    }),
    prisma.userChallenge.create({
      data: {
        userId: premiumUserId,
        challengeId: challenges[1].id, // Maestría en Colaboración
        status: 'ACTIVE',
        progress: 50, // 1 out of 2 projects
        metadata: JSON.stringify({
          completed_projects: 1,
          target_projects: 2,
          current_project: 'community-website-redesign'
        }),
      },
    }),

    // Content creator working on Innovation challenge
    prisma.userChallenge.create({
      data: {
        userId: contentCreatorUserId,
        challengeId: challenges[2].id, // Innovación para el Bien Común
        status: 'ACTIVE',
        progress: 25, // Proposal in development
        metadata: JSON.stringify({
          proposal_status: 'DRAFT',
          proposal_topic: 'Enhanced Learning Gamification',
          submission_deadline: '2025-03-01'
        }),
      },
    }),

    // Test user working towards Emprendedor Confiable
    prisma.userChallenge.create({
      data: {
        userId: testUserId1,
        challengeId: challenges[4].id, // Emprendedor Confiable
        status: 'ACTIVE',
        progress: 35, // 350 out of 1000 merits
        metadata: JSON.stringify({
          current_merits: 350,
          target_merits: 1000,
          merits_sources: ['content_creation', 'community_help', 'quality_contributions']
        }),
      },
    }),
  ]);

  console.log(`  ✓ Created ${userChallenges.length} user challenge participations`);

  // ========================================
  // FINAL SUMMARY
  // ========================================
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📈 Summary of created data:');

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.role.count(),
    prisma.permission.count(),
    prisma.userRole.count(),
    prisma.rolePermission.count(),
    prisma.mundo.count(),
    prisma.playlist.count(),
    prisma.videoItem.count(),
    prisma.subtitle.count(),
    prisma.question.count(),
    prisma.answerOption.count(),
    prisma.wallet.count(),
    prisma.token.count(),
    prisma.merit.count(),
    prisma.transaction.count(),
    prisma.group.count(),
    prisma.userGroup.count(),
    prisma.giftCard.count(),
    prisma.analyticsData.count(),
    prisma.world.count(),
    prisma.stage.count(),
    prisma.experience.count(),
    prisma.activity.count(),
    prisma.challenge.count(),
    prisma.challengeReward.count(),
    prisma.userChallenge.count(),
    prisma.publication.count(),
    prisma.comment.count(),
    prisma.like.count(),
    prisma.marketplaceItem.count(),
  ]);

  const [
    userCount, roleCount, permissionCount, userRoleCount, rolePermissionCount,
    mundoCount, playlistCount, videoItemCount, subtitleCount, questionCount,
    answerOptionCount, walletCount, tokenCount, meritCount, transactionCount,
    groupCount, userGroupCount, giftCardCount, analyticsCount, worldCount,
    stageCount, experienceCount, activityCount, challengeCount, challengeRewardCount,
    userChallengeCount, publicationCount, commentCount, likeCount, marketplaceItemCount
  ] = counts;

  console.log(`  👥 Users: ${userCount}`);
  console.log(`  🔐 Roles: ${roleCount}`);
  console.log(`  🔑 Permissions: ${permissionCount}`);
  console.log(`  👤 User-Role Assignments: ${userRoleCount}`);
  console.log(`  🔗 Role-Permission Assignments: ${rolePermissionCount}`);
  console.log(`  🌍 Mundos: ${mundoCount}`);
  console.log(`  📂 Playlists: ${playlistCount}`);
  console.log(`  📹 Video Items: ${videoItemCount}`);
  console.log(`  📝 Subtitles: ${subtitleCount}`);
  console.log(`  ❓ Questions: ${questionCount}`);
  console.log(`  🔤 Answer Options: ${answerOptionCount}`);
  console.log(`  💰 Wallets: ${walletCount}`);
  console.log(`  🪙 Tokens: ${tokenCount}`);
  console.log(`  🏆 Merits: ${meritCount}`);
  console.log(`  💸 Transactions: ${transactionCount}`);
  console.log(`  👥 Groups: ${groupCount}`);
  console.log(`  🔗 User-Group Assignments: ${userGroupCount}`);
  console.log(`  🎁 Gift Cards: ${giftCardCount}`);
  console.log(`  📊 Analytics Events: ${analyticsCount}`);
  console.log(`  🌐 CoomÜnity Worlds: ${worldCount}`);
  console.log(`  📍 Stages: ${stageCount}`);
  console.log(`  🎯 Experiences: ${experienceCount}`);
  console.log(`  🎮 Activities: ${activityCount}`);
  console.log(`  🏆 Challenges: ${challengeCount}`);
  console.log(`  🎁 Challenge Rewards: ${challengeRewardCount}`);
  console.log(`  👥 User Challenge Participations: ${userChallengeCount}`);
  console.log(`  📱 Publications: ${publicationCount}`);
  console.log(`  💬 Comments: ${commentCount}`);
  console.log(`  ❤️ Likes: ${likeCount}`);
  console.log(`  🛒 Marketplace Items: ${marketplaceItemCount}`);

  console.log('\n🔗 Login Credentials:');
  console.log('  Admin: admin@gamifier.com / admin123');
  console.log('  User: user@gamifier.com / 123456');
  console.log('  Moderator: moderator@gamifier.com / 123456');
  console.log('  Premium: premium@gamifier.com / 123456');
  console.log('  Creator: creator@gamifier.com / 123456');

  console.log('\n✨ The Gamifier Admin is now fully populated with test data!');
}

// ========================================
// EXECUTION AND ERROR HANDLING
// ========================================
main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  });

