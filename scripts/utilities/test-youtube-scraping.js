const fetch = require('node-fetch');

async function testYouTubeScraping() {
  console.log('🕸️ YouTube Scraping Duration Test\n');

  const videoId = 'EEZkQv25uEs';
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  console.log(`🎯 Testing video URL: ${videoUrl}`);
  
  try {
    console.log('📡 Fetching YouTube page...');
    
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
    });
    
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const html = await response.text();
      console.log(`📄 HTML length: ${html.length} characters`);
      
      // Buscar patrones de duración en el HTML
      const durationPatterns = [
        /"lengthSeconds":"(\d+)"/,
        /"approxDurationMs":"(\d+)"/,
        /lengthSeconds":"(\d+)"/,
        /duration":"(\d+)"/,
        /"duration":{"simpleText":"(\d+:\d+)"/,
        /<meta itemprop="duration" content="PT(\d+)M(\d+)S">/,
        /<meta itemprop="duration" content="PT(\d+)H(\d+)M(\d+)S">/
      ];
      
      let foundDuration = false;
      
      for (const pattern of durationPatterns) {
        const match = html.match(pattern);
        if (match) {
          console.log(`✅ Found pattern: ${pattern.source}`);
          console.log(`✅ Match: ${match[0]}`);
          
          if (pattern.source.includes('lengthSeconds')) {
            const seconds = parseInt(match[1]);
            console.log(`🎯 Duration: ${seconds} seconds (${Math.floor(seconds/60)}:${(seconds%60).toString().padStart(2,'0')})`);
            foundDuration = true;
            break;
          } else if (pattern.source.includes('approxDurationMs')) {
            const milliseconds = parseInt(match[1]);
            const seconds = Math.round(milliseconds / 1000);
            console.log(`🎯 Duration: ${seconds} seconds (${Math.floor(seconds/60)}:${(seconds%60).toString().padStart(2,'0')})`);
            foundDuration = true;
            break;
          } else if (pattern.source.includes('simpleText')) {
            const timeString = match[1];
            const [minutes, seconds] = timeString.split(':').map(Number);
            const totalSeconds = minutes * 60 + seconds;
            console.log(`🎯 Duration: ${totalSeconds} seconds (${timeString})`);
            foundDuration = true;
            break;
          } else if (pattern.source.includes('itemprop="duration"')) {
            if (match.length === 3) {
              // PT5M23S format
              const minutes = parseInt(match[1]);
              const seconds = parseInt(match[2]);
              const totalSeconds = minutes * 60 + seconds;
              console.log(`🎯 Duration: ${totalSeconds} seconds (${minutes}:${seconds.toString().padStart(2,'0')})`);
            } else if (match.length === 4) {
              // PT1H5M23S format
              const hours = parseInt(match[1]);
              const minutes = parseInt(match[2]);
              const seconds = parseInt(match[3]);
              const totalSeconds = hours * 3600 + minutes * 60 + seconds;
              console.log(`🎯 Duration: ${totalSeconds} seconds (${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')})`);
            }
            foundDuration = true;
            break;
          }
        }
      }
      
      if (!foundDuration) {
        console.log('⚠️ No duration pattern found in HTML');
        
        // Buscar algunas líneas que contengan "duration" para debug
        const lines = html.split('\n');
        const durationLines = lines.filter(line => line.toLowerCase().includes('duration')).slice(0, 5);
        
        if (durationLines.length > 0) {
          console.log('\n🔍 Lines containing "duration":');
          durationLines.forEach((line, i) => {
            console.log(`${i+1}: ${line.trim().substring(0, 100)}...`);
          });
        }
      }
      
    } else {
      console.log(`❌ Failed to fetch: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testYouTubeScraping().catch(console.error); 