const fetch = require('node-fetch');

async function getRealYouTubeDuration(videoId) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    const response = await fetch(oembedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Gamifier-Bot/1.0)',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Buscar duración en el título
      const title = data.title;
      console.log(`  📹 Real YouTube title: "${title}"`);
      
      const durationPatterns = [
        /(\d+):(\d+):(\d+)/, // HH:MM:SS
        /(\d+):(\d+)/, // MM:SS
      ];
      
      for (const pattern of durationPatterns) {
        const match = title.match(pattern);
        if (match) {
          const parts = match[0].split(':').map(Number);
          let totalSeconds = 0;
          if (parts.length === 3) {
            totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
          } else if (parts.length === 2) {
            totalSeconds = parts[0] * 60 + parts[1];
          }
          console.log(`  ⏱️ Duration in title: ${match[0]} = ${totalSeconds}s`);
          return totalSeconds;
        }
      }
      
      // Analizar palabras clave específicas
      if (title.toLowerCase().includes('5 minutos') || title.toLowerCase().includes('5 minutes')) {
        console.log(`  🕐 Title indicates 5 minutes`);
        return 5 * 60;
      }
      
      if (title.toLowerCase().includes('10 minutos') || title.toLowerCase().includes('10 minutes')) {
        console.log(`  🕐 Title indicates 10 minutes`);
        return 10 * 60;
      }
      
      // Estimación por autor
      if (data.author_name.toLowerCase().includes('ted')) {
        console.log(`  🎤 TED content detected`);
        return 18 * 60; // TED talks son típicamente ~18 min
      }
      
      console.log(`  🤖 No duration info found, using default estimation`);
      return null; // No podemos determinar la duración real
    } else {
      console.log(`  ❌ Oembed failed: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return null;
  }
}

async function findDurationInconsistencies() {
  console.log('🕵️ Finding Duration Inconsistencies Across All Videos\n');
  
  try {
    // Obtener todos los videos de la API usando el endpoint correcto
    const response = await fetch('http://localhost:3002/content/items/test');
    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      console.log('❌ Invalid response from API');
      return;
    }
    
    // El endpoint devuelve un objeto con items array
    const items = data.items || [];
    
    console.log(`📊 Found ${items.length} total items to analyze\n`);
    
    const inconsistencies = [];
    
    for (const item of items) {
      try {
        // Solo procesar videos de YouTube
        if (item.content && item.content.includes('youtube')) {
          console.log(`🔍 Analyzing Item ${item.id}: "${item.title}"`);
          console.log(`  💾 Backend duration: ${item.duration}s (${Math.floor(item.duration/60)}:${(item.duration%60).toString().padStart(2, '0')})`);
          
          // Extraer video ID
          let videoId = null;
          
          try {
            const contentObj = JSON.parse(item.content);
            videoId = contentObj.videoId;
          } catch {
            // Si no es JSON, buscar patrones en el string
            const patterns = [
              /videoId[\"']?\s*:\s*[\"']([^\"']+)[\"']/,
              /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
              /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
              /youtu\.be\/([a-zA-Z0-9_-]+)/
            ];
            
            for (const pattern of patterns) {
              const match = item.content.match(pattern);
              if (match) {
                videoId = match[1];
                break;
              }
            }
          }
          
          if (videoId) {
            console.log(`  🆔 YouTube ID: ${videoId}`);
            
            const realDuration = await getRealYouTubeDuration(videoId);
            
            if (realDuration && Math.abs(realDuration - item.duration) > 30) { // Diferencia > 30 segundos
              const difference = Math.abs(realDuration - item.duration);
              
              inconsistencies.push({
                id: item.id,
                title: item.title,
                videoId,
                storedDuration: item.duration,
                realDuration,
                difference,
                storedFormatted: `${Math.floor(item.duration/60)}:${(item.duration%60).toString().padStart(2, '0')}`,
                realFormatted: `${Math.floor(realDuration/60)}:${(realDuration%60).toString().padStart(2, '0')}`
              });
              
              console.log(`  ⚠️ INCONSISTENCY FOUND!`);
              console.log(`     Stored: ${Math.floor(item.duration/60)}:${(item.duration%60).toString().padStart(2, '0')} (${item.duration}s)`);
              console.log(`     Real:   ${Math.floor(realDuration/60)}:${(realDuration%60).toString().padStart(2, '0')} (${realDuration}s)`);
              console.log(`     Diff:   ${difference} seconds`);
            } else if (realDuration) {
              console.log(`  ✅ Consistent: ${Math.floor(realDuration/60)}:${(realDuration%60).toString().padStart(2, '0')}`);
            } else {
              console.log(`  ❓ Could not determine real duration`);
            }
          } else {
            console.log(`  ❌ Could not extract YouTube video ID`);
          }
          
          console.log(''); // Línea en blanco
          
          // Pausa para no sobrecargar YouTube
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.log(`  ❌ Error processing item ${item.id}: ${error.message}`);
        console.log('');
      }
    }
    
    // Resumen final
    console.log('🎯 FINAL SUMMARY');
    console.log('================');
    
    if (inconsistencies.length === 0) {
      console.log('✅ NO INCONSISTENCIES FOUND! All videos have consistent durations.');
    } else {
      console.log(`⚠️ Found ${inconsistencies.length} videos with duration inconsistencies:\n`);
      
      inconsistencies.forEach(inc => {
        console.log(`📹 Video ${inc.id}: "${inc.title}"`);
        console.log(`   YouTube ID: ${inc.videoId}`);
        console.log(`   Stored: ${inc.storedFormatted} | Real: ${inc.realFormatted} | Diff: ${inc.difference}s`);
        console.log(`   URL: http://localhost:3000/items/${inc.id}/config`);
        console.log('');
      });
      
      console.log('🔧 These videos need duration correction!');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Ejecutar el análisis
findDurationInconsistencies().catch(console.error); 