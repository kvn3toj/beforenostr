#!/bin/bash

# 🔍 SCRIPT DE VERIFICACIÓN ÜPLAY CON DATOS REALES
# ================================================
# Este script verifica que el dashboard ÜPlay esté mostrando datos reales
# del backend en lugar de datos mock

echo "🔍 ===== VERIFICACIÓN ÜPLAY CON DATOS REALES ====="
echo ""

# 1. Verificar backend
echo "📡 1. Verificando Backend NestJS..."
if curl -s -f http://localhost:3002/health > /dev/null; then
    echo "✅ Backend respondiendo en puerto 3002"
    
    # Test endpoints clave
    echo "🔍 Verificando endpoints de videos..."
    
    # Videos endpoint
    VIDEO_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3002/video-items")
    if [ "$VIDEO_RESPONSE" = "200" ]; then
        echo "✅ Endpoint /video-items disponible (HTTP 200)"
        
        # Contar videos
        VIDEO_COUNT=$(curl -s "http://localhost:3002/video-items" | jq 'length' 2>/dev/null || echo "Error parsing JSON")
        if [[ "$VIDEO_COUNT" =~ ^[0-9]+$ ]] && [ "$VIDEO_COUNT" -gt 0 ]; then
            echo "✅ Videos encontrados en DB: $VIDEO_COUNT"
        else
            echo "⚠️ No se pudieron contar videos o DB vacía"
        fi
    else
        echo "❌ Endpoint /video-items no disponible (HTTP $VIDEO_RESPONSE)"
    fi
    
    # Playlists endpoint  
    PLAYLIST_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3002/playlist")
    if [ "$PLAYLIST_RESPONSE" = "200" ]; then
        echo "✅ Endpoint /playlist disponible (HTTP 200)"
    else
        echo "❌ Endpoint /playlist no disponible (HTTP $PLAYLIST_RESPONSE)"
    fi
    
else
    echo "❌ Backend NO disponible en puerto 3002"
    echo "   EJECUTA: npm run dev:backend"
    exit 1
fi

echo ""

# 2. Verificar SuperApp
echo "🎮 2. Verificando SuperApp..."
if curl -s -I http://localhost:3001 > /dev/null; then
    echo "✅ SuperApp respondiendo en puerto 3001"
else
    echo "❌ SuperApp NO disponible en puerto 3001"
    echo "   EJECUTA: npm run dev:superapp"
    exit 1
fi

echo ""

# 3. Verificar archivos de seeding
echo "📄 3. Verificando archivos de seeding..."
cd Demo/apps/superapp-unified/scripts/

if [ -f "playlists-gamificadas-data.json" ]; then
    echo "✅ Datos extraídos disponibles"
    
    # Verificar contenido
    VIDEO_COUNT_FILE=$(cat playlists-gamificadas-data.json | jq '.metadata.totalVideos' 2>/dev/null || echo "0")
    PLAYLIST_COUNT_FILE=$(cat playlists-gamificadas-data.json | jq '.metadata.totalPlaylists' 2>/dev/null || echo "0")
    
    echo "   - Videos procesados: $VIDEO_COUNT_FILE"
    echo "   - Playlists procesadas: $PLAYLIST_COUNT_FILE"
else
    echo "❌ Archivo de datos no encontrado"
    echo "   EJECUTA: node extract-playlist-data.js"
fi

if [ -f "seeding-result.json" ]; then
    echo "✅ Resultado de seeding disponible"
    
    # Verificar resultado
    VIDEOS_CREATED=$(cat seeding-result.json | jq '.videosCreated' 2>/dev/null || echo "0")
    PLAYLISTS_CREATED=$(cat seeding-result.json | jq '.playlistsCreated' 2>/dev/null || echo "0")
    
    echo "   - Videos creados en DB: $VIDEOS_CREATED"
    echo "   - Playlists creadas en DB: $PLAYLISTS_CREATED"
    
    if [ "$VIDEOS_CREATED" -gt 0 ]; then
        echo "✅ Seeding ejecutado exitosamente"
    else
        echo "⚠️ Seeding parece no haber creado videos"
    fi
else
    echo "⚠️ No hay resultado de seeding"
    echo "   EJECUTA: node seed-backend-videos.js"
fi

echo ""

# 4. Verificar componente ÜPlay actualizado
echo "🎬 4. Verificando componente ÜPlay reescrito..."
cd ../

if [ -f "src/components/modules/uplay/UPlayGamifiedDashboard.tsx" ]; then
    echo "✅ UPlayGamifiedDashboard reescrito encontrado"
    
    # Verificar que use hooks reales
    if grep -q "useVideos" "src/components/modules/uplay/UPlayGamifiedDashboard.tsx"; then
        echo "✅ Usa hook useVideos (datos reales)"
    else
        echo "⚠️ No encuentra hook useVideos"
    fi
    
    # Verificar que NO use datos mock
    if grep -q "mock\|hardcode\|fake" "src/components/modules/uplay/UPlayGamifiedDashboard.tsx"; then
        echo "⚠️ Posibles referencias a datos mock encontradas"
    else
        echo "✅ Sin referencias a datos mock"
    fi
else
    echo "❌ UPlayGamifiedDashboard no encontrado"
fi

echo ""

# 5. Instrucciones de verificación visual
echo "👀 5. VERIFICACIÓN VISUAL REQUERIDA:"
echo "===================================="
echo ""
echo "🌐 Abre: http://localhost:3001/uplay"
echo ""
echo "✅ DEBERÍAS VER (datos reales):"
echo "  📁 4 secciones de playlists expandibles:"
echo "    🎬 Documentales y Películas Transformadoras (5 videos)"
echo "    🎥 Clips Inspiradores (3 videos)"
echo "    💡 LifeHacks para el Bienestar (2 videos)"  
echo "    🎤 Charlas TED Transformadoras (4 videos)"
echo ""
echo "  📹 Cada video debería mostrar:"
echo "    - Thumbnail real de YouTube"
echo "    - Títulos como 'The Game Changers', 'Economía Sagrada', etc."
echo "    - Duración realista (5min para clips, 90min para documentales)"
echo "    - Badges de categorías CoomÜnity"
echo "    - Méritos específicos (1-5 según el contenido)"
echo ""
echo "❌ NO DEBERÍAS VER (datos mock):"
echo "  - Videos con títulos genéricos como 'Video 1', 'Sample Video'"
echo "  - Duración siempre igual (ej. 10:00 para todos)"
echo "  - Thumbnails de placeholder"
echo "  - Mensajes de 'Sin datos' o 'Loading...'"
echo ""
echo "🎯 DIFERENCIA CLAVE:"
echo "  ANTES: UI similar sin importar el backend"
echo "  AHORA: UI refleja contenido real estructurado por playlists"
echo ""

# 6. Comandos útiles para debugging
echo "🛠️ 6. COMANDOS DE DEBUGGING:"
echo "============================="
echo ""
echo "# Ver logs del backend:"
echo "curl http://localhost:3002/video-items | jq"
echo ""
echo "# Ver playlists:"
echo "curl http://localhost:3002/playlist | jq"
echo ""
echo "# Reejecutar seeding:"
echo "./complete-video-seeding.sh"
echo ""
echo "# Ver este reporte nuevamente:"
echo "./verify-uplay-real-data.sh"

# Volver al directorio original
cd ../../../..