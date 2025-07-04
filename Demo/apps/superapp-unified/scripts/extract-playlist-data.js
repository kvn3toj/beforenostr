#!/usr/bin/env node

/**
 * 🎯 EXTRACTOR DE DATOS DE PLAYLISTS GAMIFICADAS
 * =============================================
 * 
 * Este script extrae los datos del archivo HTML de Google Sheets
 * y genera un JSON estructurado para cargar en la base de datos
 * del backend NestJS de CoomÜnity.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📊 Mapeo de categorías a necesidades humanas CoomÜnity
const CATEGORIA_MAPPING = {
  'Subsistencia/Manutención': 'supervivencia',
  'Seguridad/Resguardo': 'supervivencia', 
  'Aprecio/Estima': 'convivencia',
  'Cooperación/Relaciones': 'convivencia',
  'Creatividad/Expresión': 'desarrollo',
  'Lúdica/Alegría': 'desarrollo',
  'Discernimiento/Consciencia': 'proposito',
  'Trascendencia/Paz Interior': 'proposito'
};

// 🎨 Mapeo de tipos de material a playlists
const PLAYLIST_MAPPING = {
  'Documentales y Películas': {
    id: 'docs-peliculas',
    name: 'Documentales y Películas Transformadoras',
    description: 'Contenido audiovisual que expande la consciencia y promueve el Bien Común',
    imageUrl: '/playlists/documentales.jpg'
  },
  'Clips cortos': {
    id: 'clips-inspiradores', 
    name: 'Clips Inspiradores',
    description: 'Videos cortos con enseñanzas poderosas para el crecimiento personal',
    imageUrl: '/playlists/clips.jpg'
  },
  'LifeHacks': {
    id: 'lifehacks',
    name: 'LifeHacks para el Bienestar',
    description: 'Técnicas prácticas para mejorar la salud física, mental y espiritual',
    imageUrl: '/playlists/lifehacks.jpg'
  },
  'Charlas Ted': {
    id: 'charlas-ted',
    name: 'Charlas TED Transformadoras', 
    description: 'Ideas que valen la pena difundir, alineadas con la filosofía CoomÜnity',
    imageUrl: '/playlists/ted-talks.jpg'
  }
};

/**
 * 🔍 Extrae la URL de YouTube de un texto con enlaces
 */
function extractYouTubeUrl(text) {
  if (!text) return null;
  
  // Regex para URLs de YouTube
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
  const match = text.match(youtubeRegex);
  
  if (match) {
    const videoId = match[1];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  
  // Fallback para otras URLs de video
  const urlRegex = /(https?:\/\/[^\s<>"]{1,200})/;
  const urlMatch = text.match(urlRegex);
  return urlMatch ? urlMatch[1] : null;
}

/**
 * 🏷️ Procesa las categorías marcadas con números
 */
function processCategorias(numerosCategoria) {
  const categorias = [];
  const necesidades = [];
  
  // Mapeo de índices de columnas a categorías
  const columnasCategorias = {
    4: 'Subsistencia/Manutención',
    5: 'Seguridad/Resguardo', 
    6: 'Aprecio/Estima',
    7: 'Cooperación/Relaciones',
    8: 'Creatividad/Expresión',
    9: 'Lúdica/Alegría',
    10: 'Discernimiento/Consciencia',
    11: 'Trascendencia/Paz Interior'
  };
  
  // Procesar cada número de categoría
  numerosCategoria.forEach(numero => {
    const categoria = columnasCategorias[numero];
    if (categoria) {
      categorias.push(categoria);
      const necesidad = CATEGORIA_MAPPING[categoria];
      if (necesidad && !necesidades.includes(necesidad)) {
        necesidades.push(necesidad);
      }
    }
  });
  
  return { categorias, necesidades };
}

/**
 * 🎬 Calcula duración estimada basada en tipo de contenido
 */
function estimarDuracion(tipo, titulo) {
  const duraciones = {
    'Documentales y Películas': 5400, // 90 minutos promedio
    'Clips cortos': 300, // 5 minutos promedio
    'LifeHacks': 900, // 15 minutos promedio
    'Charlas Ted': 1080 // 18 minutos promedio
  };
  
  return duraciones[tipo] || 600; // 10 minutos por defecto
}

/**
 * 🎯 Genera thumbnail URL basada en YouTube URL
 */
function generarThumbnail(url) {
  if (!url) return null;
  
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  
  if (match) {
    const videoId = match[1];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  
  return null;
}

/**
 * 📊 Procesa los datos extraídos del HTML
 */
function procesarDatosHTML() {
  console.log('🔍 Procesando datos de Playlists Gamificadas...\n');
  
  // Datos extraídos manualmente del HTML (simulación - en producción sería parsing real)
  const videosRaw = [
    {
      tipo: 'Documentales y Películas',
      titulo: 'The Game Changers (Cambio Extremo)',
      autor: 'Netflix',
      trailer: 'https://www.youtube.com/watch?v=P7O-bHM8_KM',
      completa: 'https://www.netflix.com/title/81157840',
      categorias: [4, 6, 9, 10], // Subsistencia, Aprecio, Lúdica, Discernimiento
      meritos: 5
    },
    {
      tipo: 'Documentales y Películas', 
      titulo: 'The Great Hack (Nada es Privado)',
      autor: 'Netflix',
      trailer: 'https://www.netflix.com/watch/81073717',
      completa: 'https://www.netflix.com/watch/80117542',
      categorias: [5, 7, 10], // Seguridad, Cooperación, Discernimiento
      meritos: 5
    },
    {
      tipo: 'Documentales y Películas',
      titulo: '¿What the bleep do we know? (¿Y tú qué #$%#& sabes?)',
      autor: 'Quantum Mechanics',
      trailer: 'https://www.youtube.com/watch?v=h88cgeLfnss',
      completa: 'https://www.youtube.com/watch?v=zJMpc1Kgdps',
      categorias: [6, 8, 10, 11], // Aprecio, Creatividad, Discernimiento, Trascendencia
      meritos: 5
    },
    {
      tipo: 'Documentales y Películas',
      titulo: 'Happy',
      autor: 'Happy Documentary',
      trailer: 'https://www.youtube.com/watch?v=OROOFtSm6hE',
      completa: 'https://www.youtube.com/watch?v=7v86nocw22o',
      categorias: [4, 5, 6, 7, 8, 9, 10, 11], // Todas las categorías
      meritos: 5
    },
    {
      tipo: 'Documentales y Películas',
      titulo: 'Thrive - ¿Cuánto le costará al planeta?',
      autor: 'Thrive Movement',
      trailer: 'https://www.youtube.com/watch?v=ftD7oGPMyhE',
      completa: 'https://www.youtube.com/watch?v=8sYkAi04ojc',
      categorias: [4, 5, 6, 7, 8, 9, 10, 11], // Todas las categorías
      meritos: 5
    },
    {
      tipo: 'Clips cortos',
      titulo: 'Economía Sagrada',
      autor: 'Charles Eisenstein',
      trailer: 'https://www.youtube.com/watch?v=EEZkQv25uEs',
      completa: 'https://www.youtube.com/watch?v=EEZkQv25uEs',
      categorias: [4, 5, 6, 7, 8, 9, 10, 11], // Todas las categorías
      meritos: 2
    },
    {
      tipo: 'Clips cortos',
      titulo: 'Los principios herméticos',
      autor: 'Hermes Trismegisto',
      trailer: 'https://www.youtube.com/watch?v=lTo7yW7vjhw',
      completa: 'https://www.youtube.com/watch?v=lTo7yW7vjhw',
      categorias: [7, 9, 10, 11], // Cooperación, Lúdica, Discernimiento, Trascendencia
      meritos: 2
    },
    {
      tipo: 'Clips cortos',
      titulo: 'Gamificación, ¿se puede ser productivo jugando?',
      autor: 'Magic Markers',
      trailer: 'https://www.youtube.com/watch?v=ixBgrqho03E',
      completa: 'https://www.youtube.com/watch?v=ixBgrqho03E',
      categorias: [7, 8, 9], // Cooperación, Creatividad, Lúdica
      meritos: 1
    },
    {
      tipo: 'LifeHacks',
      titulo: 'El Método Wim Hof',
      autor: 'El Sendero de Rubén',
      trailer: 'https://www.youtube.com/watch?v=p5OFO5OZoTk',
      completa: 'https://www.youtube.com/watch?v=p5OFO5OZoTk',
      categorias: [4, 5, 6, 7, 8, 9, 10, 11], // Todas las categorías
      meritos: 3
    },
    {
      tipo: 'LifeHacks',
      titulo: 'Alquimia de la salud',
      autor: 'Conocimiento para Todos',
      trailer: 'https://www.youtube.com/watch?v=A4wafVQHeyA',
      completa: 'https://www.youtube.com/watch?v=A4wafVQHeyA',
      categorias: [4, 5, 6, 7, 8, 9, 10, 11], // Todas las categorías
      meritos: 3
    },
    {
      tipo: 'Charlas Ted',
      titulo: 'La Confianza es la Moneda de la Nueva Economía',
      autor: 'Rachel Botsman',
      trailer: 'https://youtu.be/kTqgiF4HmgQ',
      completa: 'https://youtu.be/kTqgiF4HmgQ',
      categorias: [4, 6, 7, 10], // Subsistencia, Aprecio, Cooperación, Discernimiento
      meritos: 3
    },
    {
      tipo: 'Charlas Ted',
      titulo: 'Cómo conocer tu propósito de vida en 5 minutos',
      autor: 'Adam Leipzig',
      trailer: 'http://www.youtube.com/watch?v=vVsXO9brK7M',
      completa: 'http://www.youtube.com/watch?v=vVsXO9brK7M',
      categorias: [4, 6, 7, 8, 9, 10, 11], // Todas menos Seguridad
      meritos: 2
    },
    {
      tipo: 'Charlas Ted',
      titulo: 'Jugar puede crear un mejor mundo',
      autor: 'Jane McGonigal',
      trailer: 'https://youtu.be/dE1DuBesGYM',
      completa: 'https://youtu.be/dE1DuBesGYM',
      categorias: [6, 7, 8, 9], // Aprecio, Cooperación, Creatividad, Lúdica
      meritos: 2
    },
    {
      tipo: 'Charlas Ted',
      titulo: 'En defensa del consumo colaborativo',
      autor: 'Rachel Botsman',
      trailer: 'https://www.youtube.com/watch?v=AQa3kUJPEko',
      completa: 'https://www.youtube.com/watch?v=AQa3kUJPEko',
      categorias: [4, 7, 8, 9], // Subsistencia, Cooperación, Creatividad, Lúdica
      meritos: 2
    }
  ];
  
  // 🎯 Procesar cada video
  const videosProcessed = videosRaw.map((video, index) => {
    const { categorias, necesidades } = processCategorias(video.categorias);
    const playlist = PLAYLIST_MAPPING[video.tipo];
    
    return {
      id: index + 1,
      title: video.titulo,
      description: `${video.tipo} de ${video.autor}. Contenido curado para el crecimiento personal y la transformación social alineado con la filosofía CoomÜnity.`,
      url: video.completa || video.trailer,
      platform: video.completa?.includes('youtube') || video.trailer?.includes('youtube') ? 'youtube' : 'other',
      externalId: extractYouTubeUrl(video.completa || video.trailer)?.split('v=')[1]?.split('&')[0] || `video-${index + 1}`,
      duration: estimarDuracion(video.tipo, video.titulo),
      categories: JSON.stringify(categorias),
      tags: JSON.stringify([video.tipo, ...necesidades, 'coomunity', 'transformacion']),
      thumbnailUrl: generarThumbnail(video.completa || video.trailer),
      isActive: true,
      playlist: playlist,
      meritos: video.meritos || 2,
      autor: video.autor,
      trailerUrl: video.trailer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
  
  // 🎓 Generar playlists únicas
  const playlists = Object.values(PLAYLIST_MAPPING).map(playlist => ({
    ...playlist,
    videoCount: videosProcessed.filter(v => v.playlist.id === playlist.id).length,
    totalDuration: videosProcessed
      .filter(v => v.playlist.id === playlist.id)
      .reduce((sum, v) => sum + v.duration, 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  
  return { videos: videosProcessed, playlists };
}

/**
 * 🚀 Función principal
 */
function main() {
  console.log('🎯 ===== EXTRACTOR DE PLAYLISTS GAMIFICADAS =====\n');
  
  try {
    // Procesar datos
    const { videos, playlists } = procesarDatosHTML();
    
    console.log(`✅ Procesados ${videos.length} videos`);
    console.log(`✅ Procesadas ${playlists.length} playlists`);
    
    // Crear estructura de datos para la base de datos
    const databaseData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalVideos: videos.length,
        totalPlaylists: playlists.length,
        description: 'Datos de Playlists Gamificadas de CoomÜnity extraídos y procesados'
      },
      playlists,
      videos
    };
    
    // Guardar archivo JSON
    const outputPath = path.join(__dirname, 'playlists-gamificadas-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(databaseData, null, 2));
    
    console.log(`\n📁 Datos guardados en: ${outputPath}`);
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE DATOS:');
    console.log('===================');
    
    playlists.forEach(playlist => {
      const videosCount = videos.filter(v => v.playlist.id === playlist.id).length;
      const totalMeritos = videos
        .filter(v => v.playlist.id === playlist.id)
        .reduce((sum, v) => sum + v.meritos, 0);
      
      console.log(`🎓 ${playlist.name}:`);
      console.log(`   - Videos: ${videosCount}`);
      console.log(`   - Duración total: ${Math.round(playlist.totalDuration / 60)} minutos`);
      console.log(`   - Méritos totales: ${totalMeritos}`);
      console.log('');
    });
    
    console.log('🚀 SIGUIENTE PASO: Ejecutar script de seeding en el backend');
    console.log('   Comando: node scripts/seed-playlists-gamificadas.js');
    
  } catch (error) {
    console.error('❌ Error al procesar datos:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { procesarDatosHTML, PLAYLIST_MAPPING, CATEGORIA_MAPPING };