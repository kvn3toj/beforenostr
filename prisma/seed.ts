import { PrismaClient } from '../src/generated/prisma/index.js';
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
    
    await prisma.question.deleteMany();
    console.log('  ✓ Deleted all questions');
    
    await prisma.subtitle.deleteMany();
    console.log('  ✓ Deleted all subtitles');
    
    await prisma.videoItem.deleteMany();
    console.log('  ✓ Deleted all video items');
    
    // Clean new entities
    await prisma.playlist.deleteMany();
    console.log('  ✓ Deleted all playlists');
    
    await prisma.mundo.deleteMany();
    console.log('  ✓ Deleted all mundos');
    
    // Note: The following tables might not exist in the current schema
    // but are referenced in the codebase. Uncomment when they become available:
    
    // await prisma.userChallenge?.deleteMany();
    // await prisma.challengeReward?.deleteMany();
    // await prisma.challenge?.deleteMany();
    // await prisma.meritTransaction?.deleteMany();
    // await prisma.wallet?.deleteMany();
    // await prisma.merit?.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.user.deleteMany();
    // await prisma.appConfig?.deleteMany();
    
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
  const mundo1Id = '11111111-1111-1111-1111-111111111111';
  const mundo2Id = '22222222-2222-2222-2222-222222222222';
  const playlist1Id = '33333333-3333-3333-3333-333333333333';
  const playlist2Id = '44444444-4444-4444-4444-444444444444';
  const playlist3Id = '55555555-5555-5555-5555-555555555555';
  const videoItemTypeId = '66666666-6666-6666-6666-666666666666';
  const articleItemTypeId = '77777777-7777-7777-7777-777777777777';

  // ========================================
  // STEP 2.1: Create Users
  // ========================================
  console.log('👥 Creating users...');
  
  // Hash default passwords
  const defaultPassword = await bcrypt.hash('123456', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: adminUserId,
        email: 'admin@gamifier.com',
        name: 'Administrator',
        password: adminPassword,
        avatarUrl: 'https://example.com/avatars/admin.jpg',
        isActive: true,
      },
    }),
    
    prisma.user.create({
      data: {
        id: regularUserId,
        email: 'user@gamifier.com',
        name: 'Regular User',
        password: defaultPassword,
        avatarUrl: 'https://example.com/avatars/user.jpg',
        isActive: true,
      },
    }),
  ]);
  
  console.log(`  ✓ Created ${users.length} users with hashed passwords`);

  // ========================================
  // STEP 2.2: Create Roles
  // ========================================
  console.log('🔐 Creating roles...');
  
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrator with full system access',
    },
  });
  
  const userRole = await prisma.role.create({
    data: {
      name: 'user',
      description: 'Regular user with limited access',
    },
  });
  
  const moderatorRole = await prisma.role.create({
    data: {
      name: 'moderator',
      description: 'Moderator with content management access',
    },
  });
  
  console.log('  ✓ Created 3 roles');

  // ========================================
  // STEP 2.3: Create Permissions
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
  ]);
  
  console.log(`  ✓ Created ${permissions.length} permissions`);

  // ========================================
  // STEP 2.4: Assign Permissions to Roles
  // ========================================
  console.log('🔗 Assigning permissions to roles...');
  
  // Admin role gets all permissions
  const adminPermissions = await Promise.all(
    permissions.map(permission =>
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
  const userPermissions = await Promise.all([
    prisma.rolePermission.create({
      data: {
        roleId: userRole.id,
        permissionId: permissions.find(p => p.name === 'content:read')!.id,
        assignedById: adminUserId,
      },
    }),
  ]);
  
  // Moderator role gets content management permissions
  const moderatorPermissions = await Promise.all([
    prisma.rolePermission.create({
      data: {
        roleId: moderatorRole.id,
        permissionId: permissions.find(p => p.name === 'content:read')!.id,
        assignedById: adminUserId,
      },
    }),
    prisma.rolePermission.create({
      data: {
        roleId: moderatorRole.id,
        permissionId: permissions.find(p => p.name === 'content:write')!.id,
        assignedById: adminUserId,
      },
    }),
    prisma.rolePermission.create({
      data: {
        roleId: moderatorRole.id,
        permissionId: permissions.find(p => p.name === 'users:read')!.id,
        assignedById: adminUserId,
      },
    }),
  ]);
  
  console.log('  ✓ Assigned permissions to roles');

  // ========================================
  // STEP 2.5: Assign Roles to Users
  // ========================================
  console.log('👤 Assigning roles to users...');
  
  // Assign admin role to admin user
  await prisma.userRole.create({
    data: {
      userId: adminUserId,
      roleId: adminRole.id,
      assignedById: adminUserId,
    },
  });
  
  // Assign user role to regular user
  await prisma.userRole.create({
    data: {
      userId: regularUserId,
      roleId: userRole.id,
      assignedById: adminUserId,
    },
  });
  
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
      },
    }),
    
    prisma.mundo.create({
      data: {
        id: mundo2Id,
        name: 'Mundo de Desarrollo Profesional',
        description: 'Espacio para el crecimiento y desarrollo de habilidades profesionales',
        imageUrl: 'https://example.com/images/professional-world.jpg',
        isActive: true,
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
      },
    }),
  ]);
  
  console.log(`  ✓ Created ${playlists.length} playlists`);

  // ========================================
  // STEP 5: Create VideoItems (main content)
  // ========================================
  console.log('📹 Creating video items...');
  
  const videoItems = await Promise.all([
    prisma.videoItem.create({
      data: {
        title: 'Introducción a la Gamificación',
        description: 'Aprende los conceptos básicos de la gamificación y cómo aplicarlos en la educación.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>',
        playlistId: playlist1Id,
        itemTypeId: 'video',
        order: 1,
        isActive: true,
      },
    }),
    
    prisma.videoItem.create({
      data: {
        title: 'Elementos de Juego en Educación',
        description: 'Descubre cómo los elementos de juego pueden transformar la experiencia educativa.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ScMzIvxBSi4" frameborder="0" allowfullscreen></iframe>',
        playlistId: playlist1Id,
        itemTypeId: 'video',
        order: 2,
        isActive: true,
      },
    }),
    
    prisma.videoItem.create({
      data: {
        title: 'Mecánicas de Recompensa',
        description: 'Entiende cómo diseñar sistemas de recompensa efectivos que motiven a los estudiantes.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/9bZkp7q19f0" frameborder="0" allowfullscreen></iframe>',
        playlistId: playlist2Id,
        itemTypeId: 'video',
        order: 1,
        isActive: true,
      },
    }),
    
    prisma.videoItem.create({
      data: {
        title: 'Narrativa y Storytelling',
        description: 'Aprende a crear narrativas envolventes que mantengan a los estudiantes comprometidos.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZXsQAXx_ao0" frameborder="0" allowfullscreen></iframe>',
        playlistId: playlist2Id,
        itemTypeId: 'video',
        order: 2,
        isActive: true,
      },
    }),
    
    prisma.videoItem.create({
      data: {
        title: 'Evaluación Gamificada',
        description: 'Descubre métodos innovadores para evaluar el progreso de los estudiantes a través del juego.',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/kJQP7kiw5Fk" frameborder="0" allowfullscreen></iframe>',
        playlistId: playlist3Id,
        itemTypeId: 'video',
        order: 1,
        isActive: true,
      },
    }),
  ]);
  
  console.log(`  ✓ Created ${videoItems.length} video items`);

  // ========================================
  // STEP 6: Create Subtitles
  // ========================================
  console.log('📝 Creating subtitles...');
  
  const subtitles = await Promise.all([
    // Subtitles for first video - Spanish
    prisma.subtitle.create({
      data: {
        videoItemId: videoItems[0].id,
        languageCode: 'es-ES',
        format: 'srt',
        content: `1
00:00:00,000 --> 00:00:05,000
Bienvenidos al curso de Gamificación en Educación

2
00:00:05,000 --> 00:00:10,000
En este video aprenderemos los conceptos básicos

3
00:00:10,000 --> 00:00:15,000
de cómo aplicar elementos de juego en el aprendizaje`,
        isActive: true,
      },
    }),
    
    // Subtitles for first video - English
    prisma.subtitle.create({
      data: {
        videoItemId: videoItems[0].id,
        languageCode: 'en-US',
        format: 'srt',
        content: `1
00:00:00,000 --> 00:00:05,000
Welcome to the Gamification in Education course

2
00:00:05,000 --> 00:00:10,000
In this video we will learn the basic concepts

3
00:00:10,000 --> 00:00:15,000
of how to apply game elements in learning`,
        isActive: true,
      },
    }),
    
    // Subtitles for second video - Spanish
    prisma.subtitle.create({
      data: {
        videoItemId: videoItems[1].id,
        languageCode: 'es-ES',
        format: 'srt',
        content: `1
00:00:00,000 --> 00:00:05,000
Los elementos de juego incluyen puntos, insignias

2
00:00:05,000 --> 00:00:10,000
tablas de clasificación y desafíos

3
00:00:10,000 --> 00:00:15,000
Cada elemento tiene un propósito específico`,
        isActive: true,
      },
    }),
  ]);
  
  console.log(`  ✓ Created ${subtitles.length} subtitles`);

  // ========================================
  // STEP 7: Create Interactive Questions
  // ========================================
  console.log('❓ Creating interactive questions...');
  
  // Question 1: Multiple choice for first video
  const question1 = await prisma.question.create({
    data: {
      videoItemId: videoItems[0].id,
      timestamp: 60, // 1 minute into the video
      endTimestamp: 75, // Aparece por 15 segundos
      type: 'multiple-choice',
      text: '¿Qué es la gamificación?',
      languageCode: 'es-ES',
      isActive: true,
    },
  });
  
  // Answer options for question 1
  await Promise.all([
    prisma.answerOption.create({
      data: {
        questionId: question1.id,
        text: 'La aplicación de elementos de juego en contextos no lúdicos',
        isCorrect: true,
        order: 0,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: question1.id,
        text: 'Un tipo de videojuego educativo',
        isCorrect: false,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: question1.id,
        text: 'Una metodología de enseñanza tradicional',
        isCorrect: false,
        order: 2,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: question1.id,
        text: 'Un software especializado para educación',
        isCorrect: false,
        order: 3,
      },
    }),
  ]);
  
  // Question 2: Short answer for second video
  const question2 = await prisma.question.create({
    data: {
      videoItemId: videoItems[1].id,
      timestamp: 120, // 2 minutes into the video
      endTimestamp: 135, // Aparece por 15 segundos
      type: 'short-answer',
      text: 'Menciona tres elementos de juego que se pueden usar en educación.',
      languageCode: 'es-ES',
      isActive: true,
    },
  });
  
  // Question 3: True/False for third video
  const question3 = await prisma.question.create({
    data: {
      videoItemId: videoItems[2].id,
      timestamp: 90, // 1.5 minutes into the video
      endTimestamp: 102, // Aparece por 12 segundos
      type: 'true-false',
      text: 'Las recompensas extrínsecas siempre son más efectivas que las intrínsecas.',
      languageCode: 'es-ES',
      isActive: true,
    },
  });
  
  // Question 4: Multiple choice in English for fourth video
  const question4 = await prisma.question.create({
    data: {
      videoItemId: videoItems[3].id,
      timestamp: 75, // 1 minute 15 seconds into the video
      endTimestamp: 90, // Aparece por 15 segundos
      type: 'multiple-choice',
      text: 'What is the most important element of storytelling in gamification?',
      languageCode: 'en-US',
      isActive: true,
    },
  });
  
  // Answer options for question 4
  await Promise.all([
    prisma.answerOption.create({
      data: {
        questionId: question4.id,
        text: 'Creating relatable characters',
        isCorrect: false,
        order: 0,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: question4.id,
        text: 'Building a compelling narrative arc',
        isCorrect: true,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: question4.id,
        text: 'Using complex plot twists',
        isCorrect: false,
        order: 2,
      },
    }),
  ]);
  
  // Question 5: Multiple choice for fifth video
  const question5 = await prisma.question.create({
    data: {
      videoItemId: videoItems[4].id,
      timestamp: 45, // 45 seconds into the video
      endTimestamp: 57, // Aparece por 12 segundos
      type: 'multiple-choice',
      text: '¿Cuál es la ventaja principal de la evaluación gamificada?',
      languageCode: 'es-ES',
      isActive: true,
    },
  });
  
  // Answer options for question 5
  await Promise.all([
    prisma.answerOption.create({
      data: {
        questionId: question5.id,
        text: 'Es más fácil de calificar',
        isCorrect: false,
        order: 0,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: question5.id,
        text: 'Reduce la ansiedad del estudiante',
        isCorrect: true,
        order: 1,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: question5.id,
        text: 'Requiere menos preparación',
        isCorrect: false,
        order: 2,
      },
    }),
    prisma.answerOption.create({
      data: {
        questionId: question5.id,
        text: 'Es más económica',
        isCorrect: false,
        order: 3,
      },
    }),
  ]);
  
  console.log('  ✓ Created 5 interactive questions with answer options');

  // ========================================
  // STEP 8: Additional example data for context
  // ========================================
  console.log('📊 Creating additional sample data for completeness...');
  
  // Create some additional video items with different configurations
  const additionalVideoItem = await prisma.videoItem.create({
    data: {
      title: 'Caso de Estudio: Gamificación en Universidad',
      description: 'Análisis de un caso real de implementación de gamificación en educación superior.',
      content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/L_LUpnjgPso" frameborder="0" allowfullscreen></iframe>',
      playlistId: playlist3Id,
      itemTypeId: 'video',
      order: 2,
      isActive: false, // Inactive example
    },
  });
  
  // Create an inactive subtitle
  await prisma.subtitle.create({
    data: {
      videoItemId: additionalVideoItem.id,
      languageCode: 'es-ES',
      format: 'vtt',
      content: `WEBVTT

00:00:00.000 --> 00:00:05.000
Este es un ejemplo de subtítulo inactivo

00:00:05.000 --> 00:00:10.000
En formato VTT en lugar de SRT`,
      isActive: false,
    },
  });
  
  // Create an inactive question
  await prisma.question.create({
    data: {
      videoItemId: additionalVideoItem.id,
      timestamp: 30,
      type: 'short-answer',
      text: 'Esta es una pregunta inactiva para pruebas.',
      languageCode: 'es-ES',
      isActive: false,
    },
  });
  
  console.log('  ✓ Created additional sample data');

  // ========================================
  // FINAL SUMMARY
  // ========================================
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📈 Summary of created data:');
  
  const userCount = await prisma.user.count();
  const roleCount = await prisma.role.count();
  const permissionCount = await prisma.permission.count();
  const userRoleCount = await prisma.userRole.count();
  const rolePermissionCount = await prisma.rolePermission.count();
  const videoItemCount = await prisma.videoItem.count();
  const subtitleCount = await prisma.subtitle.count();
  const questionCount = await prisma.question.count();
  const answerOptionCount = await prisma.answerOption.count();
  
  console.log(`  👥 Users: ${userCount}`);
  console.log(`  🔐 Roles: ${roleCount}`);
  console.log(`  🔑 Permissions: ${permissionCount}`);
  console.log(`  👤 User-Role Assignments: ${userRoleCount}`);
  console.log(`  🔗 Role-Permission Assignments: ${rolePermissionCount}`);
  console.log(`  📹 Video Items: ${videoItemCount}`);
  console.log(`  📝 Subtitles: ${subtitleCount}`);
  console.log(`  ❓ Questions: ${questionCount}`);
  console.log(`  🔤 Answer Options: ${answerOptionCount}`);
  
  console.log('\n🔗 Sample UUIDs for reference:');
  console.log(`  Admin User ID: ${adminUserId}`);
  console.log(`  Regular User ID: ${regularUserId}`);
  console.log(`  Mundo 1 ID: ${mundo1Id}`);
  console.log(`  Mundo 2 ID: ${mundo2Id}`);
  console.log(`  Playlist 1 ID: ${playlist1Id}`);
  console.log(`  Playlist 2 ID: ${playlist2Id}`);
  console.log(`  Playlist 3 ID: ${playlist3Id}`);
  console.log(`  Video Item Type ID: ${videoItemTypeId}`);
  console.log(`  Article Item Type ID: ${articleItemTypeId}`);
  
  console.log('\n✨ You can now test the questions functionality in the frontend!');
  console.log('   Go to any video in VideoConfigPage > Questions tab');
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