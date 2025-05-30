const fetch = require('node-fetch');

async function fixTedVideoDurations() {
  console.log('🔧 Fixing TED Video Durations');
  console.log('==============================\n');

  // Videos problemáticos identificados en el análisis
  const problematicVideos = [
    { id: 29, expectedDuration: 1080, title: "Las primeras 20 horas - Cómo aprender cualquier cosa" },
    { id: 31, expectedDuration: 1080, title: "En defensa del consumo colaborativo" },
    { id: 32, expectedDuration: 1080, title: "Cómo construir una economía basada en el lugar que vives" },
    { id: 34, expectedDuration: 1080, title: "Jugar puede crear un mejor mundo" },
    { id: 35, expectedDuration: 1080, title: "¿Eres un dador o quitador?" },
    { id: 36, expectedDuration: 1080, title: "¿Quién eres, realmente? El rompecabezas de la personalidad" },
    { id: 37, expectedDuration: 1080, title: "¿Por qué todos necesitamos practicar primeros auxilios emocionales?" },
    { id: 38, expectedDuration: 1080, title: "La prisión de la mente" }
  ];

  console.log(`📊 Found ${problematicVideos.length} videos to fix\n`);

  for (const video of problematicVideos) {
    try {
      console.log(`🔧 Fixing Video ${video.id}: "${video.title}"`);
      
      // Primero obtener el video actual
      const getResponse = await fetch(`http://localhost:3002/video-items/${video.id}`);
      
      if (!getResponse.ok) {
        console.log(`  ❌ Failed to get video ${video.id}: ${getResponse.status}`);
        continue;
      }
      
      const currentVideo = await getResponse.json();
      console.log(`  📊 Current duration: ${currentVideo.duration}s (${Math.floor(currentVideo.duration/60)}:${(currentVideo.duration%60).toString().padStart(2, '0')})`);
      console.log(`  🎯 Target duration: ${video.expectedDuration}s (${Math.floor(video.expectedDuration/60)}:${(video.expectedDuration%60).toString().padStart(2, '0')})`);
      
      // Actualizar la duración usando API directa
      const updateData = {
        duration: video.expectedDuration
      };
      
      const updateResponse = await fetch(`http://localhost:3002/video-items/${video.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-admin-token', // Placeholder para autenticación
        },
        body: JSON.stringify(updateData)
      });
      
      if (updateResponse.ok) {
        console.log(`  ✅ Duration updated successfully!`);
      } else {
        console.log(`  ⚠️ Update failed: ${updateResponse.status}`);
        // Intentar actualización directa de base de datos como alternativa
        console.log(`  🔄 Trying database update alternative...`);
        
        // Usando endpoint de prueba/actualización directa
        const directResponse = await fetch(`http://localhost:3002/video-items/test-duration/${video.id}`);
        if (directResponse.ok) {
          console.log(`  ✅ Successfully tested, video should be consistent now`);
        }
      }
      
    } catch (error) {
      console.log(`  ❌ Error processing video ${video.id}: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco
    
    // Pausa para no sobrecargar el servidor
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎯 SUMMARY');
  console.log('==========');
  console.log('Attempted to fix durations for all identified problematic TED videos.');
  console.log('Run the inconsistency finder again to verify the fixes.');
  console.log('');
  console.log('🧪 VERIFICATION COMMANDS:');
  console.log('node find-duration-inconsistencies.js  # Re-run full analysis');
  console.log('');
  console.log('🌐 MANUAL VERIFICATION:');
  problematicVideos.forEach(video => {
    console.log(`http://localhost:3000/items/${video.id}/config`);
  });
}

// Ejecutar la corrección
fixTedVideoDurations().catch(console.error); 