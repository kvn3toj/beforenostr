const fetch = require('node-fetch');
const sqlite3 = require('sqlite3').verbose();

// Duraciones conocidas de videos TED (obtenidas manualmente)
const knownDurations = {
  'EEZkQv25uEs': 729,  // Sacred Economics with Charles Eisenstein - A Short Film (12:09)
  // Podemos añadir más aquí después
};

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

function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

async function fixTedVideoDurations() {
  console.log('🚀 Starting TED video duration fix...\n');
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./prisma/dev.db', (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Connected to SQLite database');
    });
    
    // Obtener todos los videos
    db.all(`
      SELECT id, title, content, duration 
      FROM VideoItem 
      WHERE isDeleted != 1 OR isDeleted IS NULL
    `, async (err, rows) => {
      if (err) {
        console.error('❌ Error querying videos:', err.message);
        db.close();
        reject(err);
        return;
      }
      
      console.log(`📊 Found ${rows.length} videos to process\n`);
      
      let updated = 0;
      let errors = 0;
      let verified = 0;
      
      for (const video of rows) {
        console.log(`\n🎯 Processing video ${video.id}: ${video.title}`);
        console.log(`   Current duration: ${video.duration} seconds`);
        console.log(`   Content: ${video.content}`);
        
        // Solo procesar videos de YouTube
        if (!video.content.includes('youtube.com') && !video.content.includes('youtu.be')) {
          console.log('⏭️ Skipping non-YouTube video');
          continue;
        }
        
        const videoId = extractYouTubeId(video.content);
        if (!videoId) {
          console.log('❌ Could not extract video ID');
          errors++;
          continue;
        }
        
        let realDuration = null;
        
        // Primero verificar si tenemos la duración conocida
        if (knownDurations[videoId]) {
          realDuration = knownDurations[videoId];
          console.log(`📚 Using known duration: ${realDuration}s`);
        } else {
          // Obtener duración via scraping
          realDuration = await getYouTubeDuration(videoId);
        }
        
        if (realDuration && realDuration > 0) {
          if (video.duration !== realDuration) {
            // Actualizar en la base de datos
            db.run(`
              UPDATE VideoItem 
              SET duration = ? 
              WHERE id = ?
            `, [realDuration, video.id], function(err) {
              if (err) {
                console.error(`❌ Error updating video ${video.id}:`, err.message);
                errors++;
              } else {
                console.log(`✅ UPDATED: ${video.duration}s → ${realDuration}s`);
                updated++;
              }
            });
          } else {
            console.log(`✅ VERIFIED: Duration already correct (${realDuration}s)`);
            verified++;
          }
        } else {
          console.log(`❌ ERROR: Could not get duration`);
          errors++;
        }
        
        // Pausa para no sobrecargar YouTube
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Esperar un poco para que las actualizaciones se completen
      setTimeout(() => {
        console.log(`\n🎉 COMPLETED!`);
        console.log(`   📊 Total videos: ${rows.length}`);
        console.log(`   ✅ Updated: ${updated}`);
        console.log(`   ✅ Verified: ${verified}`);
        console.log(`   ❌ Errors: ${errors}`);
        
        db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
            reject(err);
          } else {
            console.log('✅ Database connection closed');
            resolve();
          }
        });
      }, 2000);
    });
  });
}

fixTedVideoDurations().catch(console.error); 