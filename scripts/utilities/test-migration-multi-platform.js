const fetch = require('node-fetch');

async function testMigrationMultiPlatform() {
  console.log('🎯 Iniciando test de migración multi-plataforma...\n');
  
  try {
    // 1. Obtener algunos videos existentes para probar la migración automática
    console.log('📋 Probando migración automática de videos existentes...\n');
    
    const videoIds = [8, 9, 11, 12, 13]; // IDs que sabemos que existen
    
    for (const videoId of videoIds) {
      console.log(`\n🔍 Procesando video ID: ${videoId}`);
      
      try {
        const response = await fetch(`http://localhost:1111/video-items/${videoId}`);
        
        if (response.ok) {
          const video = await response.json();
          
          console.log(`   📹 Título: ${video.title}`);
          console.log(`   🎬 Plataforma: ${video.platform}`);
          console.log(`   🆔 External ID: ${video.externalId || 'null'}`);
          console.log(`   🔗 URL: ${video.url ? 'Presente' : 'null'}`);
          console.log(`   ⏱️  Duración: ${video.duration || 'null'} segundos`);
          
          // Verificar si la migración fue exitosa
          if (video.platform && video.platform !== 'youtube') {
            console.log(`   ✅ Migración exitosa: Plataforma detectada como ${video.platform}`);
          } else if (video.externalId) {
            console.log(`   ✅ Migración exitosa: External ID extraído`);
          } else {
            console.log(`   ⚠️  Migración parcial: Información básica actualizada`);
          }
          
        } else {
          console.log(`   ❌ Error al obtener video ${videoId}: ${response.status}`);
        }
      } catch (error) {
        console.log(`   ❌ Error procesando video ${videoId}: ${error.message}`);
      }
      
      // Pequeña pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n🎯 Probando detección de plataforma con contenido real...\n');
    
    // 2. Probar detección con diferentes tipos de contenido
    const testContents = [
      {
        name: 'Iframe de YouTube',
        content: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZXsQAXx_ao0" frameborder="0" allowfullscreen></iframe>'
      },
      {
        name: 'URL directa de YouTube',
        content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        name: 'JSON con videoId',
        content: JSON.stringify({ videoId: 'EEZkQv25uEs', url: 'https://www.youtube.com/watch?v=EEZkQv25uEs' })
      }
    ];
    
    for (const test of testContents) {
      console.log(`\n📋 Testing: ${test.name}`);
      
      try {
        const response = await fetch('http://localhost:1111/video-items/detect-platform', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: test.content })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`   ✅ Plataforma: ${result.platform}`);
          console.log(`   ✅ External ID: ${result.externalId || 'null'}`);
          console.log(`   ✅ Contenido: ${result.content}`);
        } else {
          console.log(`   ❌ Error: ${response.status}`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Test de migración multi-plataforma completado!');
    
  } catch (error) {
    console.error('❌ Error durante el test:', error);
  }
}

testMigrationMultiPlatform().catch(console.error); 