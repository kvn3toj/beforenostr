const fetch = require('node-fetch');

// Videos a procesar (extraídos de la base de datos)
const videos = [
  { id: 40, title: 'Elementos de Juego en Educación', videoId: 'ScMzIvxBSi4' },
  { id: 41, title: 'Narrativa y Storytelling', videoId: 'ZXsQAXx_ao0' },
  { id: 42, title: 'Mecánicas de Recompensa', videoId: '9bZkp7q19f0' },
  { id: 43, title: 'Evaluación Gamificada', videoId: 'kJQP7kiw5Fk' },
  { id: 44, title: 'Caso de Estudio: Gamificación en Universidad', videoId: 'L_LUpnjgPso' }
];

async function getYouTubeDuration(videoId) {
  console.log(`🔍 Getting duration for video ID: ${videoId}`);
  
  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
    });
    
    if (!response.ok) {
      console.log(`❌ Failed to fetch: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    
    // Buscar duración en el HTML
    const match = html.match(/"lengthSeconds":"(\d+)"/);
    if (match) {
      const duration = parseInt(match[1]);
      console.log(`✅ Found duration: ${duration} seconds (${Math.floor(duration/60)}:${(duration%60).toString().padStart(2,'0')})`);
      return duration;
    }
    
    console.log('⚠️ No duration pattern found');
    return null;
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

async function getAllVideoDurations() {
  console.log('🚀 Getting real durations for all videos...\n');
  
  const results = [];
  
  for (const video of videos) {
    console.log(`\n🎯 Processing video ${video.id}: ${video.title}`);
    
    const duration = await getYouTubeDuration(video.videoId);
    
    results.push({
      id: video.id,
      title: video.title,
      videoId: video.videoId,
      duration: duration,
      status: duration ? 'success' : 'failed'
    });
    
    // Pausa para no sobrecargar YouTube
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 RESULTS:');
  console.log('===========');
  
  results.forEach(result => {
    if (result.duration) {
      const formatted = `${Math.floor(result.duration/60)}:${(result.duration%60).toString().padStart(2,'0')}`;
      console.log(`Video ${result.id}: ${result.duration}s (${formatted}) - ${result.title}`);
    } else {
      console.log(`Video ${result.id}: FAILED - ${result.title}`);
    }
  });
  
  console.log('\n📝 SQL UPDATE COMMANDS:');
  console.log('=======================');
  
  results.forEach(result => {
    if (result.duration) {
      console.log(`UPDATE video_items SET duration = ${result.duration} WHERE id = ${result.id};`);
    }
  });
  
  return results;
}

getAllVideoDurations().catch(console.error); 