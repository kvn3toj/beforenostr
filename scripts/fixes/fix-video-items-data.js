const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function fixVideoItemsData() {
  console.log('🔧 Iniciando corrección de datos de video_items...\n');

  try {
    // 1. Crear item_types si no existen
    console.log('📝 Creando item_types...');
    
    const existingTypes = await prisma.itemType.findMany();
    if (existingTypes.length === 0) {
      await prisma.itemType.createMany({
        data: [
          {
            id: 'video',
            name: 'Video',
            description: 'Contenido de video',
            isActive: true
          },
          {
            id: 'document',
            name: 'Documento',
            description: 'Contenido de documento',
            isActive: true
          },
          {
            id: 'quiz',
            name: 'Quiz',
            description: 'Contenido de evaluación',
            isActive: true
          }
        ]
      });
      console.log('✅ Item types creados exitosamente');
    } else {
      console.log('✅ Item types ya existen');
    }

    // 2. Obtener todos los video_items con problemas
    console.log('\n📊 Analizando video_items con datos corruptos...');
    
    const videoItems = await prisma.videoItem.findMany({
      where: {
        OR: [
          { externalId: { contains: 'iframe' } },
          { externalId: { contains: 'frameborder' } },
          { externalId: { contains: 'allowfullscreen' } }
        ]
      }
    });

    console.log(`🔍 Encontrados ${videoItems.length} video_items con datos corruptos`);

    // 3. Corregir cada video_item
    let corrected = 0;
    let errors = 0;

    for (const item of videoItems) {
      try {
        console.log(`\n🔧 Corrigiendo video_item ID: ${item.id} - "${item.title}"`);
        console.log(`   ExternalId corrupto: ${item.externalId?.substring(0, 50)}...`);

        // Extraer el ID real del YouTube desde el externalId corrupto
        let realVideoId = null;
        
        // Buscar patrones de YouTube ID en el contenido corrupto
        const youtubeIdMatch = item.externalId?.match(/([a-zA-Z0-9_-]{11})/);
        if (youtubeIdMatch) {
          realVideoId = youtubeIdMatch[1];
        }

        // Si no se encuentra en externalId, buscar en content
        if (!realVideoId && item.content) {
          const contentIdMatch = item.content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
          if (contentIdMatch) {
            realVideoId = contentIdMatch[1];
          }
        }

        if (realVideoId) {
          // Actualizar con datos corregidos
          await prisma.videoItem.update({
            where: { id: item.id },
            data: {
              externalId: realVideoId,
              platform: 'youtube',
              url: `https://www.youtube.com/watch?v=${realVideoId}`,
              // Limpiar content si contiene iframe
              content: item.content.includes('iframe') ? 
                JSON.stringify({ videoId: realVideoId, platform: 'youtube' }) : 
                item.content,
              // Asegurar que tenga itemTypeId
              itemTypeId: item.itemTypeId || 'video'
            }
          });

          console.log(`   ✅ Corregido: externalId = ${realVideoId}`);
          corrected++;
        } else {
          console.log(`   ❌ No se pudo extraer ID válido`);
          errors++;
        }

      } catch (error) {
        console.error(`   ❌ Error corrigiendo item ${item.id}:`, error.message);
        errors++;
      }
    }

    // 4. Verificar todos los video_items y asegurar que tengan itemTypeId
    console.log('\n📝 Verificando todos los video_items...');
    
    const allItems = await prisma.videoItem.findMany();
    let itemsFixed = 0;

    for (const item of allItems) {
      if (!item.itemTypeId || item.itemTypeId === '') {
        try {
          await prisma.videoItem.update({
            where: { id: item.id },
            data: { itemTypeId: 'video' }
          });
          itemsFixed++;
        } catch (error) {
          console.error(`Error actualizando itemTypeId para item ${item.id}:`, error.message);
        }
      }
    }

    if (itemsFixed > 0) {
      console.log(`✅ Corregidos ${itemsFixed} items sin itemTypeId`);
    } else {
      console.log('✅ Todos los items ya tienen itemTypeId');
    }

    // 5. Resumen final
    console.log('\n📊 RESUMEN DE CORRECCIONES:');
    console.log(`✅ Video items corregidos: ${corrected}`);
    console.log(`❌ Errores: ${errors}`);
    console.log(`📝 Items sin tipo corregidos: ${itemsFixed}`);

    // 6. Verificar estado final
    console.log('\n🔍 Verificando estado final...');
    const finalCheck = await prisma.videoItem.findMany({
      where: {
        externalId: { contains: 'iframe' }
      }
    });

    if (finalCheck.length === 0) {
      console.log('🎉 ¡Todos los datos han sido corregidos exitosamente!');
    } else {
      console.log(`⚠️  Aún quedan ${finalCheck.length} items con problemas`);
    }

    // 7. Mostrar algunos ejemplos corregidos
    console.log('\n📋 Ejemplos de datos corregidos:');
    const examples = await prisma.videoItem.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        platform: true,
        externalId: true,
        url: true,
        itemTypeId: true
      }
    });

    examples.forEach(item => {
      console.log(`   ID: ${item.id} | ${item.title} | ${item.platform} | ${item.externalId} | ${item.itemTypeId}`);
    });

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
fixVideoItemsData().catch(console.error); 