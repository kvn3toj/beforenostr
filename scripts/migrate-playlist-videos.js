#!/usr/bin/env node

/**
 * 🎥 MIGRACIÓN DE PLAYLIST GAMIFICADAS® A BACKEND NESTJS
 * 
 * Este script extrae los videos de la playlist HTML y los migra 
 * al backend NestJS de CoomÜnity, reemplazando los videos de prueba.
 */

const fs = require('fs');
const path = require('path');

// Función para extraer el ID de YouTube de una URL
function extractYouTubeId(url) {
  if (!url) return null;
  
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Función para estimar duración basada en tipo de contenido
function estimateDuration(title, type) {
  const baseDuration = {
    'Documentales y Películas': 5400, // 90 minutos
    'Clips cortos': 300, // 5 minutos
    'LifeHacks': 600, // 10 minutos
    'Charlas Ted': 1200, // 20 minutos
  };
  
  return baseDuration[type] || 600; // Default 10 minutos
}

// Función para generar méritos basados en contenido
function calculateMerits(title, type, description) {
  let basePoints = {
    'Documentales y Películas': 5,
    'Clips cortos': 2,
    'LifeHacks': 3,
    'Charlas Ted': 4,
  }[type] || 3;
  
  // Bonificaciones por palabras clave de CoomÜnity
  const coomunityKeywords = [
    'economía', 'colaborativ', 'social', 'confianza', 'ayni', 
    'sagrada', 'comunidad', 'cooperación', 'intercambio'
  ];
  
  const content = (title + ' ' + (description || '')).toLowerCase();
  const bonusPoints = coomunityKeywords.filter(keyword => 
    content.includes(keyword)
  ).length;
  
  return Math.min(basePoints + bonusPoints, 8); // Máximo 8 méritos
}

// Videos extraídos de la playlist HTML
const playlistVideos = [
  {
    type: 'Documentales y Películas',
    title: 'The Game Changers (Cambio Extremo)',
    trailer: 'https://www.youtube.com/watch?v=P7O-bHM8_KM',
    completa: 'https://www.netflix.com/title/81157840',
    meritos: 5,
    categorias: ['Subsistencia/Manutención', 'Aprecio/Estima', 'Lúdica/Alegría', 'Discernimiento/Consciencia']
  },
  {
    type: 'Documentales y Películas',
    title: 'The Great Hack (Nada es Privado)',
    trailer: 'https://www.netflix.com/watch/81073717',
    completa: 'https://www.netflix.com/watch/80117542',
    meritos: 5,
    categorias: ['Seguridad/Resguardo', 'Cooperación/Relaciones', 'Discernimiento/Consciencia']
  },
  {
    type: 'Documentales y Películas',
    title: '¿What the bleep do we know? (¿Y tú qué #$%#& sabes?)',
    trailer: 'https://www.youtube.com/watch?v=h88cgeLfnss',
    completa: 'https://www.youtube.com/watch?v=zJMpc1Kgdps',
    meritos: 5,
    categorias: ['Aprecio/Estima', 'Creatividad/Expresión', 'Discernimiento/Consciencia', 'Trascendencia/Paz Interior']
  },
  {
    type: 'Documentales y Películas',
    title: 'Happy',
    trailer: 'https://www.youtube.com/watch?v=OROOFtSm6hE',
    completa: 'https://www.youtube.com/watch?v=7v86nocw22o',
    meritos: 5,
    categorias: ['Todas las categorías - Video holístico']
  },
  {
    type: 'Documentales y Películas',
    title: 'Thrive - ¿Cuánto le costará al planeta?',
    trailer: 'https://www.youtube.com/watch?v=ftD7oGPMyhE',
    completa: 'https://www.youtube.com/watch?v=8sYkAi04ojc',
    meritos: 5,
    categorias: ['Todas las categorías - Video sistémico']
  },
  {
    type: 'Documentales y Películas',
    title: 'Cadena de Favores',
    trailer: 'http://www.youtube.com/watch?v=zXGljphjCIk',
    completa: 'https://youtu.be/8Jx9vHXRDOc',
    meritos: 3,
    categorias: ['Aprecio/Estima', 'Cooperación/Relaciones', 'Lúdica/Alegría', 'Trascendencia/Paz Interior']
  },
  {
    type: 'Clips cortos',
    title: 'Economía Sagrada',
    autor: 'Charles Eisenstein',
    url: 'https://www.youtube.com/watch?v=EEZkQv25uEs',
    meritos: 2,
    categorias: ['Todas las categorías - Economía CoomÜnity']
  },
  {
    type: 'Clips cortos',
    title: 'Los principios herméticos',
    autor: 'Hermes Trismegisto',
    url: 'https://www.youtube.com/watch?v=lTo7yW7vjhw',
    meritos: 2,
    categorias: ['Cooperación/Relaciones', 'Lúdica/Alegría', 'Discernimiento/Consciencia', 'Trascendencia/Paz Interior']
  },
  {
    type: 'Clips cortos',
    title: 'Gamificación, ¿se puede ser productivo jugando?',
    autor: 'Magic Markers',
    url: 'https://www.youtube.com/watch?v=ixBgrqho03E',
    meritos: 1,
    categorias: ['Cooperación/Relaciones', 'Creatividad/Expresión', 'Lúdica/Alegría']
  },
  {
    type: 'Charlas Ted',
    title: 'La Confianza es la Moneda de la Nueva Economía',
    autor: 'Rachel Botsman',
    url: 'https://youtu.be/kTqgiF4HmgQ',
    meritos: 3,
    categorias: ['Subsistencia/Manutención', 'Aprecio/Estima', 'Cooperación/Relaciones', 'Discernimiento/Consciencia']
  },
  {
    type: 'Charlas Ted',
    title: 'En defensa del consumo colaborativo',
    autor: 'Rachel Botsman',
    url: 'https://www.youtube.com/watch?v=AQa3kUJPEko',
    meritos: 2,
    categorias: ['Subsistencia/Manutención', 'Cooperación/Relaciones', 'Creatividad/Expresión', 'Lúdica/Alegría']
  },
  {
    type: 'Charlas Ted',
    title: 'La dignidad humana, fundamento de una nueva economía: Banca ética',
    autor: 'Joan Antoni Melé',
    url: 'https://m.youtube.com/watch?v=1G2knMO9P_w',
    meritos: 2,
    categorias: ['Todas las categorías - Economía ética']
  },
  {
    type: 'Charlas Ted',
    title: 'Jugar puede crear un mejor mundo',
    autor: 'Jane McGonigal',
    url: 'https://youtu.be/dE1DuBesGYM',
    meritos: 2,
    categorias: ['Aprecio/Estima', 'Cooperación/Relaciones', 'Creatividad/Expresión', 'Lúdica/Alegría']
  },
];

// Función para convertir video a formato backend
function convertToBackendFormat(video, index, playlistId) {
  const url = video.url || video.trailer || video.completa;
  const youtubeId = extractYouTubeId(url);
  
  if (!youtubeId) {
    console.warn(`⚠️ No se pudo extraer ID de YouTube para: ${video.title}`);
    return null;
  }

  const description = video.autor 
    ? `Presentado por ${video.autor}. ${video.categorias?.join(', ') || ''}`
    : `Video de tipo ${video.type}. Categorías: ${video.categorias?.join(', ') || 'General'}`;

  return {
    title: video.title,
    description: description,
    content: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen></iframe>`,
    url: url,
    platform: 'youtube',
    externalId: youtubeId,
    playlistId: playlistId,
    order: index + 1,
    isActive: true,
    duration: estimateDuration(video.title, video.type),
    thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    language: 'es',
    tags: JSON.stringify([
      video.type.toLowerCase().replace(/\s+/g, '_'),
      ...(video.autor ? [video.autor.toLowerCase().replace(/\s+/g, '_')] : []),
      'coomunity',
      'gamificada'
    ]),
    categories: JSON.stringify([video.type, ...(video.categorias || [])]),
    quality: JSON.stringify({ hd: true, subtitles: false }),
    meritos: video.meritos
  };
}

// Generar SQL para migración
function generateMigrationSQL() {
  console.log('🎬 Generando SQL de migración para videos de Playlist Gamificadas®...\n');
  
  let sql = `-- 🎥 MIGRACIÓN DE PLAYLIST GAMIFICADAS® A BACKEND NESTJS
-- Fecha: ${new Date().toISOString()}
-- Fuente: Demo/apps/superapp-unified/Playlist Gamificadas®.html

-- 1. Limpiar videos de prueba existentes
DELETE FROM "VideoItem" WHERE "platform" = 'youtube' AND "externalId" IN (
  'dQw4w9WgXcQ', 'ScMzIvxBSi4', '9bZkp7q19f0', 'ZXsQAXx_ao0', 'kJQP7kiw5Fk', 'L_LUpnjgPso'
);

-- 2. Insertar videos reales de la playlist
`;

  const playlistIds = [
    '44444444-4444-4444-4444-444444444444', // Playlist 1: Documentales
    '55555555-5555-5555-5555-555555555555', // Playlist 2: Clips cortos
    '66666666-6666-6666-6666-666666666666', // Playlist 3: Charlas TED
    '77777777-7777-7777-7777-777777777777'  // Playlist 4: LifeHacks
  ];

  const itemTypeId = 'video-type-uuid'; // Placeholder

  const videosByType = {
    'Documentales y Películas': [],
    'Clips cortos': [],
    'Charlas Ted': [],
    'LifeHacks': []
  };

  // Agrupar videos por tipo
  playlistVideos.forEach(video => {
    const type = video.type;
    if (videosByType[type]) {
      videosByType[type].push(video);
    } else {
      videosByType['Clips cortos'].push(video); // Default
    }
  });

  let insertStatements = [];
  let globalOrder = 1;

  Object.keys(videosByType).forEach((type, typeIndex) => {
    const videos = videosByType[type];
    const playlistId = playlistIds[typeIndex];
    
    videos.forEach((video, videoIndex) => {
      const converted = convertToBackendFormat(video, videoIndex, playlistId);
      if (converted) {
        const insertSQL = `INSERT INTO "VideoItem" (
  "title", "description", "content", "url", "platform", "externalId",
  "playlistId", "itemTypeId", "order", "isActive", "duration",
  "thumbnailUrl", "language", "tags", "categories", "quality",
  "createdAt", "updatedAt"
) VALUES (
  '${converted.title.replace(/'/g, "''")}',
  '${converted.description.replace(/'/g, "''")}',
  '${converted.content.replace(/'/g, "''")}',
  '${converted.url}',
  '${converted.platform}',
  '${converted.externalId}',
  '${converted.playlistId}',
  (SELECT "id" FROM "ItemType" WHERE "name" = 'video' LIMIT 1),
  ${globalOrder},
  ${converted.isActive},
  ${converted.duration},
  '${converted.thumbnailUrl}',
  '${converted.language}',
  '${converted.tags}',
  '${converted.categories}',
  '${converted.quality}',
  NOW(),
  NOW()
);`;
        
        insertStatements.push(insertSQL);
        globalOrder++;
      }
    });
  });

  sql += insertStatements.join('\n\n');
  
  sql += `

-- 3. Actualizar títulos de playlists para reflejar el nuevo contenido
UPDATE "Playlist" 
SET "name" = 'Documentales y Películas Conscientes',
    "description" = 'Documentales y películas que promueven la consciencia y el bien común'
WHERE "id" = '44444444-4444-4444-4444-444444444444';

UPDATE "Playlist" 
SET "name" = 'Clips Cortos Transformadores',
    "description" = 'Videos cortos con enseñanzas profundas para la transformación personal'
WHERE "id" = '55555555-5555-5555-5555-555555555555';

UPDATE "Playlist" 
SET "name" = 'Charlas TED Inspiradoras',
    "description" = 'Charlas TED que inspiran y educan sobre temas de colaboración y nueva economía'
WHERE "id" = '66666666-6666-6666-6666-666666666666';

UPDATE "Playlist" 
SET "name" = 'LifeHacks y Sabiduría Práctica',
    "description" = 'Técnicas y hacks de vida para el desarrollo personal y bienestar integral'
WHERE "id" = '77777777-7777-7777-7777-777777777777';

-- 4. Insertar preguntas interactivas para videos clave
-- Pregunta para "Economía Sagrada"
INSERT INTO "Question" ("videoItemId", "timestamp", "type", "text", "languageCode", "isActive")
SELECT 
  v."id",
  30,
  'MULTIPLE_CHOICE',
  '¿Cuál es el principio fundamental de la Economía Sagrada según Charles Eisenstein?',
  'es',
  true
FROM "VideoItem" v 
WHERE v."title" = 'Economía Sagrada' AND v."platform" = 'youtube';

-- Pregunta para "La Confianza es la Moneda de la Nueva Economía"
INSERT INTO "Question" ("videoItemId", "timestamp", "type", "text", "languageCode", "isActive")
SELECT 
  v."id",
  60,
  'TRUE_FALSE',
  'La confianza puede medirse y cuantificarse como una moneda real.',
  'es',
  true
FROM "VideoItem" v 
WHERE v."title" = 'La Confianza es la Moneda de la Nueva Economía' AND v."platform" = 'youtube';

-- Pregunta para "Gamificación, ¿se puede ser productivo jugando?"
INSERT INTO "Question" ("videoItemId", "timestamp", "type", "text", "languageCode", "isActive")
SELECT 
  v."id",
  45,
  'MULTIPLE_CHOICE',
  '¿Cuál es la clave del éxito en la gamificación según CoomÜnity?',
  'es',
  true
FROM "VideoItem" v 
WHERE v."title" LIKE '%Gamificación%' AND v."platform" = 'youtube';

-- ✅ MIGRACIÓN COMPLETADA
-- Total de videos migrados: ${insertStatements.length}
-- Videos organizados por tipo de contenido en playlists dedicadas
-- Preguntas interactivas agregadas para engagement
-- Videos alineados con la filosofía CoomÜnity
`;

  return sql;
}

// Generar archivos de migración
function createMigrationFiles() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const sqlContent = generateMigrationSQL();
  
  // Archivo SQL
  const sqlFilePath = path.join(__dirname, `../scripts/database/migrate-playlist-videos-${timestamp}.sql`);
  fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
  
  // Archivo JSON con datos estructurados
  const jsonData = {
    metadata: {
      source: 'Demo/apps/superapp-unified/Playlist Gamificadas®.html',
      timestamp: new Date().toISOString(),
      totalVideos: playlistVideos.length,
      tipos: Object.keys(playlistVideos.reduce((acc, v) => ({ ...acc, [v.type]: true }), {}))
    },
    videos: playlistVideos.map((video, index) => convertToBackendFormat(video, index, '44444444-4444-4444-4444-444444444444')).filter(Boolean)
  };
  
  const jsonFilePath = path.join(__dirname, `../scripts/database/playlist-videos-data-${timestamp}.json`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
  
  console.log('📁 Archivos de migración creados:');
  console.log(`  🗃️ SQL: ${sqlFilePath}`);
  console.log(`  📊 JSON: ${jsonFilePath}`);
  console.log('');
  console.log('🔧 Para aplicar la migración:');
  console.log(`  1. Ejecutar el SQL en la base de datos PostgreSQL`);
  console.log(`  2. Reiniciar el backend NestJS`);
  console.log(`  3. Verificar los videos en la SuperApp ÜPlay`);
  console.log('');
  console.log('✨ Los videos de prueba serán reemplazados por contenido real alineado con CoomÜnity!');
}

// Ejecutar migración
if (require.main === module) {
  createMigrationFiles();
}

module.exports = {
  playlistVideos,
  convertToBackendFormat,
  generateMigrationSQL
}; 