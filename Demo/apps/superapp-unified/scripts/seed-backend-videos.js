#!/usr/bin/env node

/**
 * 🎯 SCRIPT DE SEEDING PARA BACKEND VIDEOS
 * ========================================
 * 
 * Este script toma los datos procesados de playlists gamificadas
 * y los inserta en la base de datos del backend NestJS usando las APIs REST.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔧 Configuración del backend
const BACKEND_URL = 'http://localhost:3002';
const ADMIN_CREDENTIALS = {
  email: 'admin@gamifier.com',
  password: 'admin123'
};

/**
 * 🔐 Obtiene token de autenticación del backend
 */
async function getAuthToken() {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ADMIN_CREDENTIALS)
    });
    
    if (!response.ok) {
      throw new Error(`Error de autenticación: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Autenticación exitosa como ${ADMIN_CREDENTIALS.email}`);
    return data.access_token;
    
  } catch (error) {
    console.error('❌ Error de autenticación:', error.message);
    throw error;
  }
}

/**
 * 🎓 Crea playlists en el backend
 */
async function createPlaylists(playlists, token) {
  console.log('\n🎓 Creando playlists...');
  const createdPlaylists = [];
  
  for (const playlist of playlists) {
    try {
      // Mapear estructura para el backend
      const playlistData = {
        name: playlist.name,
        description: playlist.description,
        imageUrl: playlist.imageUrl,
        isPublic: true,
        itemType: 'video' // Asumiendo que el backend requiere este campo
      };
      
      const response = await fetch(`${BACKEND_URL}/playlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(playlistData)
      });
      
      if (!response.ok) {
        console.warn(`⚠️ Error creando playlist "${playlist.name}": ${response.status}`);
        continue;
      }
      
      const createdPlaylist = await response.json();
      createdPlaylists.push(createdPlaylist);
      console.log(`   ✅ Playlist creada: ${playlist.name} (ID: ${createdPlaylist.id})`);
      
    } catch (error) {
      console.error(`❌ Error creando playlist "${playlist.name}":`, error.message);
    }
  }
  
  return createdPlaylists;
}

/**
 * 🎬 Crea videos en el backend
 */
async function createVideos(videos, playlistsMap, token) {
  console.log('\n🎬 Creando videos...');
  const createdVideos = [];
  
  for (const video of videos) {
    try {
      // Mapear estructura para el backend
      const videoData = {
        title: video.title,
        description: video.description,
        url: video.url,
        platform: video.platform,
        externalId: video.externalId,
        duration: video.duration,
        thumbnailUrl: video.thumbnailUrl,
        isActive: video.isActive,
        categories: video.categories, // JSON string
        tags: video.tags, // JSON string
        // Buscar el ID real de la playlist creada
        playlistId: playlistsMap[video.playlist.id] || null
      };
      
      const response = await fetch(`${BACKEND_URL}/video-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(videoData)
      });
      
      if (!response.ok) {
        console.warn(`⚠️ Error creando video "${video.title}": ${response.status}`);
        const errorText = await response.text();
        console.warn(`   Error details: ${errorText}`);
        continue;
      }
      
      const createdVideo = await response.json();
      createdVideos.push(createdVideo);
      console.log(`   ✅ Video creado: ${video.title} (ID: ${createdVideo.id})`);
      
    } catch (error) {
      console.error(`❌ Error creando video "${video.title}":`, error.message);
    }
  }
  
  return createdVideos;
}

/**
 * 🔍 Verifica la conexión con el backend
 */
async function checkBackendConnection() {
  try {
    console.log('🔍 Verificando conexión con el backend...');
    const response = await fetch(`${BACKEND_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`Backend no disponible: ${response.status}`);
    }
    
    const health = await response.json();
    console.log(`✅ Backend disponible: ${health.message || 'OK'}`);
    return true;
    
  } catch (error) {
    console.error('❌ Backend no disponible:', error.message);
    console.error('   Asegúrate de que el backend esté ejecutándose en puerto 3002');
    return false;
  }
}

/**
 * 🚀 Función principal
 */
async function main() {
  console.log('🎯 ===== SEEDING DE VIDEOS EN BACKEND =====\n');
  
  try {
    // 1. Verificar conexión con backend
    const backendAvailable = await checkBackendConnection();
    if (!backendAvailable) {
      process.exit(1);
    }
    
    // 2. Cargar datos procesados
    const dataPath = path.join(__dirname, 'playlists-gamificadas-data.json');
    if (!fs.existsSync(dataPath)) {
      console.error('❌ Archivo de datos no encontrado:', dataPath);
      console.error('   Ejecuta primero: node extract-playlist-data.js');
      process.exit(1);
    }
    
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const { playlists, videos, metadata } = JSON.parse(rawData);
    
    console.log(`📊 Datos cargados:`);
    console.log(`   - ${videos.length} videos`);
    console.log(`   - ${playlists.length} playlists`);
    console.log(`   - Generado: ${new Date(metadata.generatedAt).toLocaleString()}`);
    
    // 3. Autenticarse
    const token = await getAuthToken();
    
    // 4. Crear playlists
    const createdPlaylists = await createPlaylists(playlists, token);
    
    // 5. Crear mapeo de playlists (ID original → ID backend)
    const playlistsMap = {};
    createdPlaylists.forEach(playlist => {
      // Buscar la playlist original por nombre
      const originalPlaylist = playlists.find(p => p.name === playlist.name);
      if (originalPlaylist) {
        playlistsMap[originalPlaylist.id] = playlist.id;
      }
    });
    
    console.log(`\n🗺️ Mapeo de playlists:`);
    Object.entries(playlistsMap).forEach(([originalId, backendId]) => {
      console.log(`   ${originalId} → ${backendId}`);
    });
    
    // 6. Crear videos
    const createdVideos = await createVideos(videos, playlistsMap, token);
    
    // 7. Resumen final
    console.log('\n🎉 ===== SEEDING COMPLETADO =====');
    console.log(`✅ Playlists creadas: ${createdPlaylists.length}/${playlists.length}`);
    console.log(`✅ Videos creados: ${createdVideos.length}/${videos.length}`);
    
    if (createdVideos.length > 0) {
      console.log('\n🚀 ¡La base de datos ahora tiene contenido real!');
      console.log('   El dashboard ÜPlay debería mostrar los videos y playlists.');
      console.log('   Visita: http://localhost:3001/uplay');
    }
    
    // 8. Guardar resultado de seeding
    const seedingResult = {
      executedAt: new Date().toISOString(),
      success: true,
      playlistsCreated: createdPlaylists.length,
      videosCreated: createdVideos.length,
      createdPlaylists: createdPlaylists,
      createdVideos: createdVideos.map(v => ({ id: v.id, title: v.title }))
    };
    
    const resultPath = path.join(__dirname, 'seeding-result.json');
    fs.writeFileSync(resultPath, JSON.stringify(seedingResult, null, 2));
    console.log(`\n📄 Resultado guardado en: ${resultPath}`);
    
  } catch (error) {
    console.error('\n❌ Error durante el seeding:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { getAuthToken, createPlaylists, createVideos };