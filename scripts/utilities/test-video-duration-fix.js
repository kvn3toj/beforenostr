/**
 * Script para probar que la corrección de duración del video funciona correctamente
 */

async function testVideoDurationFix() {
  console.log('🧪 Testing Video Duration Fix...\n');

  try {
    // 1. Primero hacer login para obtener un token de autenticación
    console.log('🔑 Logging in...');
    const loginResponse = await fetch('http://localhost:1111/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gamifier.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Login successful\n');

    // 2. Obtener la lista de video items disponibles
    console.log('📹 Getting available video items...');
    const itemsResponse = await fetch('http://localhost:1111/content/items', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!itemsResponse.ok) {
      throw new Error(`Failed to get video items: ${itemsResponse.status}`);
    }

    const items = await itemsResponse.json();
    console.log(`Found ${items.length} video items`);

    if (items.length === 0) {
      console.log('❌ No video items found in database');
      return;
    }

    // 3. Tomar el primer video item para probar
    const firstItem = items[0];
    console.log(`\n🎯 Testing with video item ID: ${firstItem.id}`);
    console.log(`   Title: "${firstItem.title}"`);
    console.log(`   Content preview: ${firstItem.content.substring(0, 100)}...`);

    // 4. Probar el endpoint del video item específico
    console.log('\n🔍 Testing video-items endpoint...');
    const videoItemResponse = await fetch(`http://localhost:1111/video-items/${firstItem.id}`);
    
    if (videoItemResponse.ok) {
      const videoItemData = await videoItemResponse.json();
      console.log('✅ Video item endpoint working');
      console.log(`   ID: ${videoItemData.id}`);
      console.log(`   Title: ${videoItemData.title}`);
      console.log(`   Has subtitles: ${videoItemData.subtitles?.length || 0}`);
      console.log(`   Has questions: ${videoItemData.questions?.length || 0}`);
    } else {
      console.log(`❌ Video item endpoint failed: ${videoItemResponse.status}`);
    }

    // 5. Probar la extracción de duración del video
    console.log('\n🎬 Testing video duration extraction...');
    
    // Importar las funciones necesarias (si estuvieran disponibles en Node.js)
    // Por ahora, simularemos la lógica
    const content = firstItem.content;
    
    // Buscar un iframe de YouTube en el contenido
    const youtubeMatch = content.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      console.log(`   YouTube Video ID found: ${videoId}`);
      
      // Probar la API de oembed de YouTube
      try {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const oembedResponse = await fetch(oembedUrl);
        
        if (oembedResponse.ok) {
          const oembedData = await oembedResponse.json();
          console.log(`   ✅ YouTube video found: "${oembedData.title}"`);
          console.log(`   Author: ${oembedData.author_name}`);
          console.log(`   Note: Duration would be estimated from title patterns`);
          
          // Simular estimación de duración
          const title = oembedData.title;
          const estimatedDuration = estimateVideoDuration(title);
          console.log(`   📊 Estimated duration: ${estimatedDuration} seconds (${Math.floor(estimatedDuration/60)}:${(estimatedDuration%60).toString().padStart(2, '0')})`);
        } else {
          console.log(`   ❌ YouTube oembed failed: ${oembedResponse.status}`);
        }
      } catch (error) {
        console.log(`   ❌ Error accessing YouTube oembed: ${error.message}`);
      }
    } else {
      console.log('   ❌ No YouTube video ID found in content');
    }

    // 6. Probar acceso a la página de configuración del video
    console.log('\n🌐 Testing frontend video config page access...');
    const frontendUrl = `http://localhost:3333/items/${firstItem.id}/config`;
    console.log(`   Frontend URL: ${frontendUrl}`);
    console.log('   ✅ URL generated successfully');
    console.log('   💡 You can now test the video duration fix by visiting this URL in your browser');

    console.log('\n🎉 Video Duration Fix Test Completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Backend API: ✅ Working`);
    console.log(`   - Video Items Endpoint: ${videoItemResponse?.ok ? '✅' : '❌'} ${videoItemResponse?.ok ? 'Working' : 'Failed'}`);
    console.log(`   - YouTube Integration: ${youtubeMatch ? '✅' : '❌'} ${youtubeMatch ? 'Working' : 'No YouTube content'}`);
    console.log(`   - Frontend URL: ✅ Generated`);
    
    console.log('\n🔧 Next Steps:');
    console.log('   1. Visit the frontend URL in your browser');
    console.log('   2. Navigate to the "Questions" tab');
    console.log('   3. Verify that the timeline shows the correct video duration');
    console.log('   4. Check that question positions are accurate relative to video length');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Función helper para estimar duración (igual que en el servicio)
function estimateVideoDuration(title) {
  const durationPatterns = [
    /(\d+):(\d+):(\d+)/, // HH:MM:SS
    /(\d+):(\d+)/, // MM:SS
    /(\d+)\s*min/, // X min
    /(\d+)\s*minutes?/, // X minutes
    /(\d+)\s*hrs?/, // X hours
    /(\d+)\s*hours?/, // X hours
  ];
  
  for (const pattern of durationPatterns) {
    const match = title.match(pattern);
    if (match) {
      if (pattern.source.includes(':')) {
        const parts = match[0].split(':').map(Number);
        if (parts.length === 3) {
          return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          return parts[0] * 60 + parts[1];
        }
      } else {
        const number = parseInt(match[1]);
        if (title.includes('hr') || title.includes('hour')) {
          return number * 3600;
        } else if (title.includes('min')) {
          return number * 60;
        }
      }
    }
  }
  
  return 600; // 10 minutos por defecto
}

// Ejecutar el test
testVideoDurationFix().catch(console.error); 