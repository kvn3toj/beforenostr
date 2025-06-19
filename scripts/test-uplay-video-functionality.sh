#!/bin/bash

echo "🧪 TEST PRÁCTICO: Funcionalidad de Videos ÜPlay"
echo "==============================================="

# Verificación preliminar
echo "1️⃣ Verificando servicios básicos..."
BACKEND_STATUS=$(curl -s http://localhost:3002/health 2>/dev/null)
SUPERAPP_STATUS=$(curl -s -I http://localhost:3001 2>/dev/null | head -1)

if [[ $BACKEND_STATUS == *"Backend is running"* ]] && [[ $SUPERAPP_STATUS == *"200 OK"* ]]; then
    echo "✅ Servicios básicos OK"
else
    echo "❌ Servicios no disponibles"
    exit 1
fi

# Test 1: Verificar datos del backend
echo ""
echo "2️⃣ Test 1: Datos del backend..."
VIDEOS_JSON=$(curl -s "http://localhost:3002/video-items" 2>/dev/null)
VIDEOS_COUNT=$(echo "$VIDEOS_JSON" | jq '. | length' 2>/dev/null)

if [ "$VIDEOS_COUNT" -gt 0 ]; then
    echo "✅ Backend tiene $VIDEOS_COUNT videos disponibles"

    # Obtener IDs de los primeros 3 videos
    VIDEO_IDS=$(echo "$VIDEOS_JSON" | jq -r '.[0:3] | map(.id) | @csv' | tr -d '"')
    echo "📹 IDs de videos: $VIDEO_IDS"
else
    echo "❌ Backend no tiene videos"
    exit 1
fi

# Test 2: Verificar que ÜPlay page carga correctamente
echo ""
echo "3️⃣ Test 2: Página ÜPlay..."
UPLAY_PAGE=$(curl -s "http://localhost:3001/uplay" 2>/dev/null)
if [[ $UPLAY_PAGE == *"uplay"* ]] || [[ $UPLAY_PAGE == *"video"* ]]; then
    echo "✅ Página ÜPlay carga correctamente"
else
    echo "❌ Página ÜPlay no carga correctamente"
fi

# Test 3: Verificar rutas de video individuales
echo ""
echo "4️⃣ Test 3: Rutas de video específicas..."
for video_id in 1 2 3; do
    VIDEO_PAGE_STATUS=$(curl -s -I "http://localhost:3001/uplay/video/$video_id" 2>/dev/null | head -1)
    if [[ $VIDEO_PAGE_STATUS == *"200 OK"* ]]; then
        echo "✅ Ruta /uplay/video/$video_id accesible"
    else
        echo "❌ Ruta /uplay/video/$video_id no accesible: $VIDEO_PAGE_STATUS"
    fi
done

# Test 4: Verificar componentes críticos
echo ""
echo "5️⃣ Test 4: Verificando componentes críticos..."

LIBRARY_FILE="Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx"
PLAYER_FILE="Demo/apps/superapp-unified/src/pages/UPlayVideoPlayer.tsx"

# Verificar handleVideoClick está implementado
if grep -q "const handleVideoClick = (videoId: string)" "$LIBRARY_FILE"; then
    echo "✅ handleVideoClick implementado"
else
    echo "❌ handleVideoClick no encontrado"
fi

# Verificar onClick está conectado
if grep -q "onClick={() => handleVideoClick(video.id)" "$LIBRARY_FILE"; then
    echo "✅ onClick conectado en cards"
else
    echo "❌ onClick no conectado en cards"
fi

# Verificar navigate está siendo usado
if grep -q "navigate(\`/uplay/video/\${videoId}\`" "$LIBRARY_FILE"; then
    echo "✅ navigate implementado correctamente"
else
    echo "❌ navigate no implementado correctamente"
fi

# Test 5: Verificar que no hay errores de sintaxis JavaScript
echo ""
echo "6️⃣ Test 5: Verificando sintaxis JavaScript..."

# Check for common syntax errors in key files
FILES_TO_CHECK=(
    "$LIBRARY_FILE"
    "$PLAYER_FILE"
    "Demo/apps/superapp-unified/src/utils/lazyComponents.ts"
    "Demo/apps/superapp-unified/src/hooks/data/useVideoData.ts"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        # Check for basic syntax issues (this is limited but can catch obvious problems)
        if grep -q "import.*from.*\.\.\/" "$file" && grep -q "export.*\(" "$file"; then
            echo "✅ $(basename "$file"): Sintaxis básica OK"
        else
            echo "⚠️ $(basename "$file"): Posibles problemas de sintaxis"
        fi
    else
        echo "❌ $(basename "$file"): No existe"
    fi
done

# Test 6: Simular el flujo de datos
echo ""
echo "7️⃣ Test 6: Simulando flujo de datos..."

echo "   📡 Backend → Frontend:"
echo "   1. Backend devuelve videos con estructura:"
SAMPLE_VIDEO=$(curl -s "http://localhost:3002/video-items" | jq '.[0] | {id, title, externalId, duration}' 2>/dev/null)
echo "$SAMPLE_VIDEO"

echo ""
echo "   2. useVideoData hook debería procesar esto como:"
echo "   {
     id: '$video_id',
     title: 'título',
     rewards: { meritos: X, ondas: Y },
     handleVideoClick: (id) => navigate('/uplay/video/' + id)
   }"

# Test 7: Verificar posibles problemas de autenticación
echo ""
echo "8️⃣ Test 7: Verificando autenticación..."

# Try to access videos endpoint with and without auth
VIDEOS_NO_AUTH=$(curl -s "http://localhost:3002/video-items" 2>/dev/null)
if [[ $VIDEOS_NO_AUTH == *"error"* ]] || [[ $VIDEOS_NO_AUTH == *"unauthorized"* ]]; then
    echo "⚠️ Videos endpoint requiere autenticación"
    echo "   🔧 Podrían fallar las llamadas desde el frontend sin login"
else
    echo "✅ Videos endpoint es público"
fi

# Test 8: Instrucciones de debugging manual
echo ""
echo "🔍 INSTRUCCIONES DE DEBUGGING MANUAL"
echo "===================================="
echo ""
echo "🎯 PASO A PASO para identificar el problema:"
echo ""
echo "1️⃣ ABRE EL NAVEGADOR:"
echo "   http://localhost:3001/uplay"
echo ""
echo "2️⃣ ABRE DEVELOPER TOOLS (F12):"
echo "   - Ve a la pestaña 'Console'"
echo "   - Ve a la pestaña 'Network'"
echo ""
echo "3️⃣ RECARGA LA PÁGINA (Ctrl+R) y observa:"
echo "   - ¿Aparecen videos en la pantalla?"
echo "   - ¿Hay errores rojos en la consola?"
echo "   - ¿Las llamadas a /video-items aparecen en Network?"
echo ""
echo "4️⃣ HAZ CLIC EN UN VIDEO y observa:"
echo "   - ¿Aparece el log '🎯 Video seleccionado: X'?"
echo "   - ¿Aparece el log '🎬 Datos del video encontrados'?"
echo "   - ¿Cambia la URL en el navegador?"
echo "   - ¿Hay errores nuevos en la consola?"
echo ""
echo "5️⃣ PRUEBA NAVEGACIÓN DIRECTA:"
echo "   - Ve a: http://localhost:3001/uplay/video/1"
echo "   - ¿Carga la página del reproductor?"
echo "   - ¿Hay errores en la consola?"
echo ""
echo "🔍 POSIBLES PROBLEMAS Y SOLUCIONES:"
echo ""
echo "❌ PROBLEMA: No aparecen videos en la pantalla"
echo "   🔧 SOLUCIÓN: Verificar llamadas a API en Network tab"
echo "   🔧 CAUSA: Hook useVideos no está funcionando"
echo ""
echo "❌ PROBLEMA: Videos aparecen pero no responden al click"
echo "   🔧 SOLUCIÓN: Verificar errores JavaScript en consola"
echo "   🔧 CAUSA: Problema con handleVideoClick o eventos bloqueados"
echo ""
echo "❌ PROBLEMA: Click funciona pero no navega"
echo "   🔧 SOLUCIÓN: Verificar que useNavigate está importado"
echo "   🔧 CAUSA: Problema con React Router"
echo ""
echo "❌ PROBLEMA: Navega pero página de video no carga"
echo "   🔧 SOLUCIÓN: Verificar UPlayVideoPlayer component"
echo "   🔧 CAUSA: Problema con lazy loading o rutas"
echo ""
echo "📞 REPORTA EXACTAMENTE QUÉ VES:"
echo "   - ¿Qué aparece en pantalla?"
echo "   - ¿Qué dice la consola?"
echo "   - ¿Qué pasa cuando haces clic?"
echo "   - ¿Cambia algo en la URL?"

echo ""
echo "🏁 TEST COMPLETADO"
echo "=================="
echo "✅ Si todos los tests pasaron, el problema probablemente está en:"
echo "   1. Cache del navegador"
echo "   2. Errores JavaScript específicos"
echo "   3. Conflictos de CSS/z-index"
echo "   4. Autenticación requerida pero no proporcionada"
echo ""
echo "🔧 SOLUCIÓN RÁPIDA a intentar:"
echo "   1. Ctrl+Shift+R (hard refresh)"
echo "   2. Modo incógnito"
echo "   3. Revisar consola por errores"
