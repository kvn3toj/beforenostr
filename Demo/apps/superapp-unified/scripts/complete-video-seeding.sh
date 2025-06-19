#!/bin/bash

# 🎯 SCRIPT COMPLETO DE SEEDING DE VIDEOS
# =======================================
# Este script ejecuta todo el proceso completo para poblar la base de datos
# con videos reales de las Playlists Gamificadas

echo "🎯 ===== PROCESO COMPLETO DE SEEDING DE VIDEOS ====="
echo ""

# 1. Verificar ubicación
CURRENT_DIR=$(pwd)
if [[ ! "$CURRENT_DIR" =~ workspace$ ]]; then
    echo "⚠️ ADVERTENCIA: Asegúrate de estar en el directorio raíz del workspace"
    echo "   Directorio actual: $CURRENT_DIR"
fi

# 2. Verificar que el backend esté ejecutándose
echo "🔍 Verificando backend..."
if curl -s -f http://localhost:3002/health > /dev/null; then
    echo "✅ Backend disponible en puerto 3002"
    BACKEND_HEALTH=$(curl -s http://localhost:3002/health)
    echo "   Health: $BACKEND_HEALTH"
else
    echo "❌ Backend NO disponible en puerto 3002"
    echo "   🚀 EJECUTA PRIMERO: npm run dev:backend (desde raíz del monorepo)"
    echo ""
    echo "   Instrucciones:"
    echo "   1. Abre una nueva terminal"
    echo "   2. cd /ruta/al/monorepo"
    echo "   3. npm run dev:backend"
    echo "   4. Vuelve aquí y ejecuta este script nuevamente"
    exit 1
fi

# 3. Verificar que la SuperApp esté ejecutándose
echo "🔍 Verificando SuperApp..."
if curl -s -I http://localhost:3001 > /dev/null; then
    echo "✅ SuperApp disponible en puerto 3001"
else
    echo "⚠️ SuperApp no disponible en puerto 3001"
    echo "   Para ver los resultados, ejecuta también: npm run dev:superapp"
fi

echo ""
echo "📊 PROCESO DE SEEDING:"
echo "====================="

# 4. Extraer datos de playlists gamificadas
echo "🔍 Paso 1: Extrayendo datos de playlists gamificadas..."
cd Demo/apps/superapp-unified/scripts/
node extract-playlist-data.js

if [ $? -ne 0 ]; then
    echo "❌ Error en la extracción de datos"
    exit 1
fi

# 5. Poblar base de datos del backend
echo ""
echo "🎬 Paso 2: Poblando base de datos del backend..."
node seed-backend-videos.js

if [ $? -ne 0 ]; then
    echo "❌ Error en el seeding del backend"
    exit 1
fi

# 6. Verificar que el nuevo dashboard ÜPlay funcione
echo ""
echo "🔍 Paso 3: Verificando integración del dashboard ÜPlay..."
sleep 2

if curl -s -I http://localhost:3001/uplay > /dev/null; then
    echo "✅ Dashboard ÜPlay accesible"
else
    echo "⚠️ Dashboard ÜPlay no accesible (SuperApp no ejecutándose)"
fi

# 7. Resumen final
echo ""
echo "🎉 ===== PROCESO COMPLETADO ====="
echo ""

if [ -f "seeding-result.json" ]; then
    echo "📊 RESULTADOS DEL SEEDING:"
    cat seeding-result.json | grep -E '"(playlistsCreated|videosCreated)"' | head -2
    echo ""
fi

echo "🚀 SIGUIENTES PASOS:"
echo "1. Visita: http://localhost:3001/uplay"
echo "2. El dashboard debería mostrar videos organizados por playlists:"
echo "   📁 Documentales y Películas Transformadoras (5 videos)"
echo "   📁 Clips Inspiradores (3 videos)"  
echo "   📁 LifeHacks para el Bienestar (2 videos)"
echo "   📁 Charlas TED Transformadoras (4 videos)"
echo ""
echo "3. Cada video debería mostrar:"
echo "   - Thumbnail real (generado desde YouTube)"
echo "   - Título y descripción"
echo "   - Duración estimada"
echo "   - Categorías CoomÜnity"
echo "   - Méritos ganables"
echo ""
echo "✨ ¡El dashboard ÜPlay ahora usa datos reales del backend!"

# Volver al directorio original
cd ../../../../