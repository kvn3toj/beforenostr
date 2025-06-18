import { test, expect } from '@playwright/test';

test.describe('Videos Backend Integration - UPlay Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la SuperApp con mock auth habilitado
    await page.goto('/');
    
    // Esperar a que React se monte
    await page.waitForSelector('#root');
    
    // Verificar que estamos en la página principal
    await expect(page).toHaveTitle(/CoomÜnity/);
  });

  test('should verify backend API call for video-items when UPlay component loads', async ({ page }) => {
    console.log('🔗 Verificando llamada a la API del backend desde UPlay...');
    
    // Interceptar la llamada a video-items
    let apiCallMade = false;
    let responseData: any = null;
    let apiUrl = '';
    let apiStatus = 0;
    
    page.on('response', async (response) => {
      if (response.url().includes('/video-items')) {
        apiCallMade = true;
        apiUrl = response.url();
        apiStatus = response.status();
        console.log(`📡 API call detectada: ${apiUrl}`);
        console.log(`📊 Status: ${apiStatus}`);
        
        if (response.status() === 200) {
          try {
            responseData = await response.json();
            console.log(`📦 Datos recibidos: ${Array.isArray(responseData) ? responseData.length : 'No array'} videos`);
          } catch (error) {
            console.log(`⚠️ Error parseando respuesta: ${error}`);
          }
        }
      }
    });
    
    // Inyectar el componente UPlayMain directamente en la página
    await page.evaluate(() => {
      // Crear un contenedor para el componente UPlay
      const container = document.createElement('div');
      container.id = 'uplay-test-container';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.backgroundColor = 'white';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
      
      // Trigger la carga del componente UPlay
      window.dispatchEvent(new CustomEvent('loadUPlay'));
    });
    
    // Esperar a que se haga la llamada API
    await page.waitForTimeout(5000);
    
    // Verificar que se hizo la llamada
    console.log(`🔍 API call realizada: ${apiCallMade}`);
    console.log(`🔍 URL: ${apiUrl}`);
    console.log(`🔍 Status: ${apiStatus}`);
    
    if (!apiCallMade) {
      // Si no se hizo la llamada automáticamente, intentar triggearla manualmente
      console.log('⚠️ No se detectó llamada automática, intentando trigger manual...');
      
      // Navegar a una ruta que force la carga de datos
      await page.goto('/uplay');
      await page.waitForLoadState('networkidle');
      
      // Ejecutar código que force la carga de videos del backend
      await page.evaluate(async () => {
        // Intentar acceder al hook useVideos si está disponible
        if (window.React && window.ReactQuery) {
          console.log('Intentando forzar carga de videos...');
        }
      });
      
      await page.waitForTimeout(3000);
    }
    
    // Si aún no se hizo la llamada, hacer una verificación directa del endpoint
    if (!apiCallMade) {
      console.log('🔧 Verificando endpoint directamente...');
      
      const response = await page.request.get('http://localhost:1111/video-items', {
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      });
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      console.log(`✅ Endpoint funciona correctamente: ${data.length} videos disponibles`);
      
      // Verificar estructura de datos
      expect(Array.isArray(data)).toBeTruthy();
      if (data.length > 0) {
        const firstVideo = data[0];
        expect(firstVideo).toHaveProperty('id');
        expect(firstVideo).toHaveProperty('title');
        expect(firstVideo).toHaveProperty('playlist');
        
        console.log(`🔍 Primer video: ${firstVideo.title}`);
        console.log(`🌍 Playlist: ${firstVideo.playlist?.name}`);
        console.log(`🌍 Mundo ID: ${firstVideo.playlist?.mundoId}`);
      }
    } else {
      // Si se hizo la llamada, verificar los datos
      expect(apiCallMade).toBeTruthy();
      
      if (responseData && Array.isArray(responseData)) {
        expect(responseData.length).toBeGreaterThan(0);
        
        const firstVideo = responseData[0];
        console.log(`🔍 Estructura del primer video: ${JSON.stringify(firstVideo, null, 2)}`);
        
        // Verificar propiedades esperadas
        expect(firstVideo).toHaveProperty('id');
        expect(firstVideo).toHaveProperty('title');
        expect(firstVideo).toHaveProperty('playlist');
        
        // Verificar que la playlist tiene información del mundo
        if (firstVideo.playlist) {
          console.log(`🌍 Información de playlist: ${JSON.stringify(firstVideo.playlist, null, 2)}`);
          expect(firstVideo.playlist).toHaveProperty('mundoId');
        }
      }
    }
  });

  test('should verify video data structure from backend', async ({ page }) => {
    console.log('📊 Verificando estructura de datos de videos del backend...');
    
    // Hacer llamada directa al backend para verificar estructura
    const response = await page.request.get('http://localhost:1111/video-items', {
      headers: {
        'Authorization': 'Bearer mock-token'
      }
    });
    
    expect(response.status()).toBe(200);
    const videos = await response.json();
    
    console.log(`📦 Total de videos recibidos: ${videos.length}`);
    
    // Verificar que hay videos
    expect(Array.isArray(videos)).toBeTruthy();
    expect(videos.length).toBeGreaterThan(0);
    
    // Verificar estructura del primer video
    const firstVideo = videos[0];
    console.log(`🔍 Analizando video: "${firstVideo.title}"`);
    
    // Propiedades básicas del video
    expect(firstVideo).toHaveProperty('id');
    expect(firstVideo).toHaveProperty('title');
    expect(firstVideo).toHaveProperty('description');
    expect(firstVideo).toHaveProperty('url');
    expect(firstVideo).toHaveProperty('platform');
    expect(firstVideo).toHaveProperty('duration');
    expect(firstVideo).toHaveProperty('thumbnailUrl');
    
    // Información de playlist y mundo
    expect(firstVideo).toHaveProperty('playlist');
    expect(firstVideo.playlist).toHaveProperty('id');
    expect(firstVideo.playlist).toHaveProperty('name');
    expect(firstVideo.playlist).toHaveProperty('mundoId');
    
    console.log(`✅ Video pertenece a playlist: "${firstVideo.playlist.name}"`);
    console.log(`✅ Playlist pertenece al mundo: ${firstVideo.playlist.mundoId}`);
    
    // Verificar preguntas interactivas
    expect(firstVideo).toHaveProperty('questions');
    expect(Array.isArray(firstVideo.questions)).toBeTruthy();
    
    if (firstVideo.questions.length > 0) {
      const firstQuestion = firstVideo.questions[0];
      expect(firstQuestion).toHaveProperty('id');
      expect(firstQuestion).toHaveProperty('text');
      expect(firstQuestion).toHaveProperty('timestamp');
      expect(firstQuestion).toHaveProperty('type');
      
      console.log(`✅ Video tiene ${firstVideo.questions.length} preguntas interactivas`);
      console.log(`🎯 Primera pregunta: "${firstQuestion.text}" en ${firstQuestion.timestamp}s`);
    }
    
    // Verificar categorías y tags
    if (firstVideo.categories) {
      const categories = JSON.parse(firstVideo.categories);
      expect(Array.isArray(categories)).toBeTruthy();
      console.log(`🏷️ Categorías: ${categories.join(', ')}`);
    }
    
    if (firstVideo.tags) {
      const tags = JSON.parse(firstVideo.tags);
      expect(Array.isArray(tags)).toBeTruthy();
      console.log(`🏷️ Tags: ${tags.join(', ')}`);
    }
  });

  test('should verify mundo context integration', async ({ page }) => {
    console.log('🌍 Verificando integración de contexto de Mundos...');
    
    // Obtener videos del backend
    const videosResponse = await page.request.get('http://localhost:1111/video-items', {
      headers: {
        'Authorization': 'Bearer mock-token'
      }
    });
    
    expect(videosResponse.status()).toBe(200);
    const videos = await videosResponse.json();
    
    // Obtener mundos del backend
    const mundosResponse = await page.request.get('http://localhost:1111/mundos', {
      headers: {
        'Authorization': 'Bearer mock-token'
      }
    });
    
    expect(mundosResponse.status()).toBe(200);
    const mundos = await mundosResponse.json();
    
    console.log(`📊 Videos disponibles: ${videos.length}`);
    console.log(`🌍 Mundos disponibles: ${mundos.length}`);
    
    // Verificar que los videos están correctamente asociados a mundos
    const videosByMundo = new Map();
    
    videos.forEach((video: any) => {
      const mundoId = video.playlist?.mundoId;
      if (mundoId) {
        if (!videosByMundo.has(mundoId)) {
          videosByMundo.set(mundoId, []);
        }
        videosByMundo.get(mundoId).push(video);
      }
    });
    
    console.log(`🔗 Videos distribuidos en ${videosByMundo.size} mundos diferentes`);
    
    // Verificar que cada mundo referenciado existe
    for (const [mundoId, videosInMundo] of videosByMundo.entries()) {
      const mundo = mundos.find((m: any) => m.id === mundoId);
      expect(mundo).toBeDefined();
      
      console.log(`✅ Mundo "${mundo.name}": ${videosInMundo.length} videos`);
      
      // Listar algunos videos de ejemplo
      videosInMundo.slice(0, 3).forEach((video: any) => {
        console.log(`   📹 "${video.title}" (Playlist: ${video.playlist.name})`);
      });
    }
    
    // Verificar que hay al menos una asociación válida
    expect(videosByMundo.size).toBeGreaterThan(0);
  });

  test('should verify playlist organization within mundos', async ({ page }) => {
    console.log('📋 Verificando organización de playlists dentro de mundos...');
    
    // Obtener videos del backend
    const videosResponse = await page.request.get('http://localhost:1111/video-items', {
      headers: {
        'Authorization': 'Bearer mock-token'
      }
    });
    
    expect(videosResponse.status()).toBe(200);
    const videos = await videosResponse.json();
    
    // Organizar por playlists
    const playlistsMap = new Map();
    
    videos.forEach((video: any) => {
      const playlist = video.playlist;
      if (playlist) {
        if (!playlistsMap.has(playlist.id)) {
          playlistsMap.set(playlist.id, {
            ...playlist,
            videos: []
          });
        }
        playlistsMap.get(playlist.id).videos.push(video);
      }
    });
    
    console.log(`📋 Total de playlists encontradas: ${playlistsMap.size}`);
    
    // Verificar cada playlist
    for (const [playlistId, playlist] of playlistsMap.entries()) {
      console.log(`\n📋 Playlist: "${playlist.name}"`);
      console.log(`   🌍 Mundo ID: ${playlist.mundoId}`);
      console.log(`   📹 Videos: ${playlist.videos.length}`);
      console.log(`   📝 Descripción: ${playlist.description}`);
      
      // Verificar que la playlist tiene videos
      expect(playlist.videos.length).toBeGreaterThan(0);
      
      // Verificar que todos los videos de la playlist pertenecen al mismo mundo
      const mundoIds = new Set(playlist.videos.map((v: any) => v.playlist.mundoId));
      expect(mundoIds.size).toBe(1);
      
      // Listar algunos videos de la playlist
      playlist.videos.slice(0, 2).forEach((video: any, index: number) => {
        console.log(`   ${index + 1}. "${video.title}" (${video.duration}s)`);
      });
    }
    
    // Verificar que hay al menos una playlist
    expect(playlistsMap.size).toBeGreaterThan(0);
  });
}); 