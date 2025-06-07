const fetch = require('node-fetch');

async function testYouTubeDurationDebug() {
  console.log('🕵️ YouTube Duration Debug Test\n');

  const videoId = 'EEZkQv25uEs'; // Video del sistema
  const apiKey = 'AIzaSyDXMoHjoHi8-xUfiD5QN6bFVIeoTMhK2z4';
  
  console.log(`🎯 Testing video ID: ${videoId}`);
  console.log(`🔑 Using API key: ${apiKey.substr(0, 10)}...`);
  
  try {
    // Test 1: Direct YouTube API call
    console.log('\n1️⃣ Testing direct YouTube API call...');
    
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`;
    console.log(`📡 API URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl, { timeout: 10000 });
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📄 API Response:', JSON.stringify(data, null, 2));
      
      if (data.items && data.items.length > 0) {
        const duration = data.items[0].contentDetails.duration;
        console.log(`⏱️ Raw duration: ${duration}`);
        
        // Parse ISO 8601 duration
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
          const hours = parseInt(match[1] || '0', 10);
          const minutes = parseInt(match[2] || '0', 10);
          const seconds = parseInt(match[3] || '0', 10);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          
          console.log(`🎯 Parsed duration: ${totalSeconds} seconds (${Math.floor(totalSeconds/60)}:${(totalSeconds%60).toString().padStart(2,'0')})`);
        } else {
          console.log('❌ Could not parse duration format');
        }
      } else {
        console.log('⚠️ No items in API response');
      }
    } else {
      console.log(`❌ API call failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }

    // Test 2: YouTube oEmbed fallback
    console.log('\n2️⃣ Testing YouTube oEmbed fallback...');
    
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    console.log(`📡 oEmbed URL: ${oembedUrl}`);
    
    const oembedResponse = await fetch(oembedUrl, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Gamifier-Bot/1.0)',
      }
    });
    
    console.log(`📊 oEmbed Response status: ${oembedResponse.status}`);
    
    if (oembedResponse.ok) {
      const oembedData = await oembedResponse.json();
      console.log('📄 oEmbed Response:', JSON.stringify(oembedData, null, 2));
      
      // Test extractDurationFromTitle logic
      if (oembedData.title) {
        console.log(`🔍 Analyzing title: "${oembedData.title}"`);
        
        const durationPatterns = [
          /\[(\d+):(\d+):(\d+)\]/, // [HH:MM:SS]
          /\[(\d+):(\d+)\]/, // [MM:SS]
          /\((\d+):(\d+):(\d+)\)/, // (HH:MM:SS)
          /\((\d+):(\d+)\)/, // (MM:SS)
          /(\d+):(\d+):(\d+)/, // HH:MM:SS
          /(\d+):(\d+)/, // MM:SS
        ];
        
        let foundDuration = false;
        for (const pattern of durationPatterns) {
          const match = oembedData.title.match(pattern);
          if (match) {
            console.log(`✅ Found duration pattern: ${match[0]}`);
            const parts = match.slice(1).map(Number);
            if (parts.length === 3) {
              const duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
              console.log(`🎯 Calculated duration: ${duration} seconds`);
            } else if (parts.length === 2) {
              const duration = parts[0] * 60 + parts[1];
              console.log(`🎯 Calculated duration: ${duration} seconds`);
            }
            foundDuration = true;
            break;
          }
        }
        
        if (!foundDuration) {
          console.log('⚠️ No duration pattern found in title');
        }
      }
    } else {
      console.log(`❌ oEmbed call failed: ${oembedResponse.status} ${oembedResponse.statusText}`);
    }

    // Test 3: Backend endpoint test
    console.log('\n3️⃣ Testing backend endpoint...');
    
    const backendUrl = 'http://localhost:3002/video-items/calculate-duration';
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `https://www.youtube.com/watch?v=${videoId}` })
    });
    
    if (backendResponse.ok) {
      const backendData = await backendResponse.json();
      console.log('📄 Backend Response:', JSON.stringify(backendData, null, 2));
    } else {
      console.log(`❌ Backend call failed: ${backendResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testYouTubeDurationDebug().catch(console.error); 