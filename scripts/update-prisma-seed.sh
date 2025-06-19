#!/bin/bash

echo "🌱 ACTUALIZANDO SEED DE PRISMA CON DATOS REALISTAS"
echo "=================================================="

BACKEND_DIR="$(pwd)/backend"
SEED_FILE="$BACKEND_DIR/../prisma/seed.ts"

if [[ ! -f "$SEED_FILE" ]]; then
    echo "❌ Error: Archivo seed.ts no encontrado en $SEED_FILE"
    exit 1
fi

echo "📄 Creando backup del seed actual..."
cp "$SEED_FILE" "${SEED_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

echo "🎥 Agregando videos realistas del backend..."

# Agregar al final del seed.ts, antes del último console.log
cat >> "$SEED_FILE" << 'EOF'

  // ========================================
  // STEP 6: Videos Realistas para ÜPlay
  // ========================================
  console.log('🎥 Creating realistic videos for ÜPlay...');
  
  const realisticVideos = await Promise.all([
    prisma.videoItem.create({
      data: {
        title: 'Introducción a CoomÜnity: El Principio de Ayni',
        description: 'Descubre los fundamentos de la reciprocidad y el bien común',
        content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'youtube',
        externalId: 'dQw4w9WgXcQ',
        playlistId: playlist1Id,
        itemTypeId: videoItemType.id,
        order: 1,
        duration: 600,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        categories: 'filosofia,principios',
        language: 'es',
        tags: 'ayni,reciprocidad,bien-comun'
      }
    }),
    
    prisma.videoItem.create({
      data: {
        title: 'Economía Colaborativa y Sistema LETS',
        description: 'Aprende cómo funciona el intercambio local y la economía del bien común',
        content: 'https://vimeo.com/383005433',
        url: 'https://vimeo.com/383005433',
        platform: 'vimeo',
        externalId: '383005433',
        playlistId: playlist2Id,
        itemTypeId: videoItemType.id,
        order: 1,
        duration: 900,
        thumbnailUrl: 'https://i.vimeocdn.com/video/383005433_640.jpg',
        categories: 'economia,intercambio',
        language: 'es',
        tags: 'lets,economia-colaborativa,lukas'
      }
    }),
    
    prisma.videoItem.create({
      data: {
        title: 'Desarrollo de Emprendedores Confiables',
        description: 'El camino hacia convertirse en un emprendedor confiable en CoomÜnity',
        content: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        platform: 'youtube',
        externalId: '9bZkp7q19f0',
        playlistId: playlist3Id,
        itemTypeId: videoItemType.id,
        order: 1,
        duration: 720,
        thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        categories: 'emprendimiento,confianza',
        language: 'es',
        tags: 'emprendedores-confiables,meritos,confianza'
      }
    })
  ]);
  
  console.log(`  ✓ Created ${realisticVideos.length} realistic videos`);

EOF

echo "✅ Videos realistas agregados al seed"
echo "🗄️ Para aplicar los cambios, ejecuta:"
echo "   cd backend && npm run db:reset"
echo ""