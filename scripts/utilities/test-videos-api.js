async function getVideosWithAuth() {
  try {
    // 1. Hacer login
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
    console.log('✅ Login successful');

    // 2. Obtener videos
    console.log('📹 Getting video items...');
    const videosResponse = await fetch('http://localhost:1111/content/items', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!videosResponse.ok) {
      throw new Error(`Failed to get videos: ${videosResponse.status}`);
    }

    const videos = await videosResponse.json();
    console.log(`\n📊 Found ${videos.length} videos:`);
    
    // Mostrar los primeros 3 videos con información relevante
    videos.slice(0, 3).forEach((video, index) => {
      console.log(`\n${index + 1}. 📹 ${video.title}`);
      console.log(`   ID: ${video.id}`);
      console.log(`   Content: ${video.content.substring(0, 100)}...`);
      
      // Extraer URL de YouTube del iframe si existe
      const youtubeMatch = video.content.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`   YouTube URL: ${youtubeUrl}`);
      }
    });

    return videos;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Ejecutar
getVideosWithAuth()
  .then(videos => {
    console.log('\n✅ Script completed successfully');
  })
  .catch(error => {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }); 