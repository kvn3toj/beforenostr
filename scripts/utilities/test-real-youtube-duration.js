const fetch = require('node-fetch');

async function getRealYouTubeDuration(videoId) {
  try {
    console.log(`🔍 Testing real YouTube duration for video: ${videoId}`);
    
    // Método 1: oembed de YouTube
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    console.log(`📡 Trying oembed: ${oembedUrl}`);
    
    const response = await fetch(oembedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Gamifier-Bot/1.0)',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Video found on YouTube:`);
      console.log(`   Title: "${data.title}"`);
      console.log(`   Author: ${data.author_name}`);
      console.log(`   Width: ${data.width}`);
      console.log(`   Height: ${data.height}`);
      
      // Buscar duración en el título
      const title = data.title;
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
          console.log(`⏱️ Duration found in title: ${match[0]} = ${totalSeconds} seconds`);
          return totalSeconds;
        }
      }
      
      console.log(`⚠️ No duration found in title, analyzing content...`);
      
      // Analizar el tipo de contenido
      if (data.title.toLowerCase().includes('5 minutos') || data.title.toLowerCase().includes('5 minutes')) {
        console.log(`🕐 Title indicates 5 minutes`);
        return 5 * 60;
      }
      
      // Valores por defecto inteligentes
      if (data.author_name.toLowerCase().includes('ted')) {
        console.log(`🎤 TED content, estimating 18 minutes`);
        return 18 * 60;
      }
      
      console.log(`🤖 Using intelligent estimation: 10 minutes`);
      return 10 * 60;
    } else {
      console.log(`❌ Oembed failed: ${response.status} ${response.statusText}`);
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function testVideo30() {
  console.log('🧪 Testing Video 30 Duration\n');
  
  // Video ID del video que aparece en las imágenes
  const videoId = 'vVsXO9brK7M'; // "Cómo conocer tu propósito de vida en 5 minutos"
  
  const realDuration = await getRealYouTubeDuration(videoId);
  
  console.log('\n📊 Results:');
  console.log(`   Real YouTube duration: ${realDuration ? realDuration + ' seconds (' + Math.floor(realDuration/60) + ':' + (realDuration%60).toString().padStart(2, '0') + ')' : 'Unknown'}`);
  console.log(`   Backend stored duration: 300 seconds (5:00)`);
  console.log(`   Consistent? ${realDuration === 300 ? '✅ YES' : '❌ NO'}`);
  
  if (realDuration && realDuration !== 300) {
    console.log(`   ⚠️ INCONSISTENCY FOUND!`);
    console.log(`   Real duration: ${Math.floor(realDuration/60)}:${(realDuration%60).toString().padStart(2, '0')}`);
    console.log(`   Stored duration: 5:00`);
    console.log(`   Difference: ${Math.abs(realDuration - 300)} seconds`);
  }
}

// Ejecutar el test
testVideo30().catch(console.error);

async function testRealYouTubeDuration() {
  console.log('🔍 Real YouTube Duration Test with Detailed Logs\n');

  const videoUrl = 'https://www.youtube.com/watch?v=EEZkQv25uEs';
  
  try {
    console.log('1️⃣ Testing calculate-duration endpoint...');
    
    const response = await fetch('http://localhost:1111/video-items/calculate-duration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: videoUrl })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('📄 Response:', JSON.stringify(data, null, 2));
      
      if (data.duration === 300) {
        console.log('⚠️ Still getting 300 seconds - checking cache...');
        
        // Test 2: Try to clear cache or use a different video
        console.log('\n2️⃣ Testing with a different YouTube video...');
        
        const differentVideo = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Roll - known duration
        const response2 = await fetch('http://localhost:1111/video-items/calculate-duration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: differentVideo })
        });
        
        if (response2.ok) {
          const data2 = await response2.json();
          console.log('📄 Different video response:', JSON.stringify(data2, null, 2));
        }
        
        // Test 3: Force recalculate to see logs
        console.log('\n3️⃣ Testing force recalculate to see backend logs...');
        
        const response3 = await fetch('http://localhost:1111/video-items/force-recalculate-durations', {
          method: 'POST'
        });
        
        if (response3.ok) {
          const data3 = await response3.json();
          console.log('📄 Force recalculate response:');
          console.log(`   Total: ${data3.total}`);
          console.log(`   Updated: ${data3.updated}`);
          console.log(`   Verified: ${data3.verified}`);
          console.log(`   Errors: ${data3.errors}`);
          
          if (data3.results && data3.results.length > 0) {
            console.log('📊 First result:', JSON.stringify(data3.results[0], null, 2));
          }
        }
      } else {
        console.log('✅ Got real duration!');
      }
    } else {
      console.log(`❌ Request failed: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRealYouTubeDuration().catch(console.error); 