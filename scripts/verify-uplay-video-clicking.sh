#!/bin/bash

echo "🎬 VERIFICACIÓN COMPLETA: Sistema de Clicks de Videos ÜPlay"
echo "=================================================================="

# Variables de verificación
BACKEND_URL="http://localhost:3002"
SUPERAPP_URL="http://localhost:3001"
BACKEND_VIDEOS_ENDPOINT="$BACKEND_URL/video-items"
SUPERAPP_UPLAY_ENDPOINT="$SUPERAPP_URL/uplay"

echo ""
echo "🔍 1. VERIFICANDO SERVICIOS ACTIVOS"
echo "======================================"

# Verificar backend
echo "🗄️ Backend NestJS ($BACKEND_URL):"
if curl -s --max-time 5 "$BACKEND_URL/health" > /dev/null; then
    echo "   ✅ Backend responde correctamente"
    BACKEND_HEALTH=$(curl -s "$BACKEND_URL/health")
    echo "   📊 Status: $BACKEND_HEALTH"
else
    echo "   ❌ Backend no responde - PROBLEMA CRÍTICO"
    exit 1
fi

# Verificar SuperApp
echo ""
echo "🌐 SuperApp Frontend ($SUPERAPP_URL):"
if curl -s --max-time 5 -I "$SUPERAPP_URL" | grep -q "200 OK"; then
    echo "   ✅ SuperApp responde correctamente"
else
    echo "   ❌ SuperApp no responde - PROBLEMA CRÍTICO"
    exit 1
fi

echo ""
echo "🔍 2. VERIFICANDO DATOS DE VIDEOS EN BACKEND"
echo "=============================================="

# Obtener videos del backend
echo "📦 Obteniendo videos desde $BACKEND_VIDEOS_ENDPOINT"
VIDEOS_RESPONSE=$(curl -s --max-time 10 "$BACKEND_VIDEOS_ENDPOINT")

if [ $? -eq 0 ] && [ ! -z "$VIDEOS_RESPONSE" ]; then
    # Contar videos usando jq si está disponible, sino usar un método alternativo
    if command -v jq &> /dev/null; then
        VIDEO_COUNT=$(echo "$VIDEOS_RESPONSE" | jq 'length')
        echo "   ✅ $VIDEO_COUNT videos encontrados en backend"

        # Mostrar algunos títulos
        echo "   📺 Títulos de videos disponibles:"
        echo "$VIDEOS_RESPONSE" | jq -r '.[0:3][] | "   - " + .title' 2>/dev/null || echo "   - Videos disponibles (formato complejo)"
    else
        echo "   ✅ Videos encontrados en backend (jq no disponible para detalles)"
    fi
else
    echo "   ❌ No se pudieron obtener videos del backend"
    exit 1
fi

echo ""
echo "🔍 3. VERIFICANDO CONFIGURACIÓN DE RUTAS"
echo "=========================================="

# Verificar que la ruta /uplay/video/:videoId existe en App.tsx
echo "🛣️ Verificando ruta de video player:"
if grep -q "/uplay/video/:videoId" Demo/apps/superapp-unified/src/App.tsx; then
    echo "   ✅ Ruta /uplay/video/:videoId configurada en App.tsx"
else
    echo "   ❌ Ruta de video player NO configurada"
fi

# Verificar UPlayVideoPlayer en lazyComponents
echo ""
echo "📁 Verificando componente UPlayVideoPlayer:"
if grep -q "UPlayVideoPlayer" Demo/apps/superapp-unified/src/utils/lazyComponents.ts; then
    echo "   ✅ UPlayVideoPlayer exportado en lazyComponents.ts"
else
    echo "   ❌ UPlayVideoPlayer NO encontrado en lazyComponents"
fi

# Verificar que el archivo de página existe
echo ""
echo "📄 Verificando página UPlayVideoPlayer:"
if [ -f "Demo/apps/superapp-unified/src/pages/UPlayVideoPlayer.tsx" ]; then
    PLAYER_SIZE=$(wc -l < Demo/apps/superapp-unified/src/pages/UPlayVideoPlayer.tsx)
    echo "   ✅ UPlayVideoPlayer.tsx existe ($PLAYER_SIZE líneas)"
else
    echo "   ❌ UPlayVideoPlayer.tsx NO existe"
fi

echo ""
echo "🔍 4. VERIFICANDO IMPLEMENTACIÓN DE CLICKS"
echo "==========================================="

# Verificar useNavigate en UPlayInteractiveLibrary
echo "🧭 Verificando hook de navegación:"
if grep -q "useNavigate" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx; then
    echo "   ✅ useNavigate importado en UPlayInteractiveLibrary"
else
    echo "   ❌ useNavigate NO importado"
fi

# Verificar función handleVideoClick
echo ""
echo "⚡ Verificando función de click:"
if grep -q "handleVideoClick" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx; then
    echo "   ✅ handleVideoClick implementada"

    # Verificar que navega correctamente
    if grep -q "navigate.*uplay/video" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx; then
        echo "   ✅ Navegación a ruta de video implementada"
    else
        echo "   ❌ Navegación a ruta de video NO implementada"
    fi
else
    echo "   ❌ handleVideoClick NO implementada"
fi

# Verificar onClick en las cards
echo ""
echo "🖱️ Verificando onClick en cards:"
if grep -q "onClick.*handleVideoClick" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx; then
    echo "   ✅ onClick conectado a handleVideoClick en cards"
else
    echo "   ❌ onClick NO conectado en cards"
fi

echo ""
echo "🔍 5. VERIFICANDO ACCESIBILIDAD DE RUTAS"
echo "=========================================="

# Probar ruta principal de ÜPlay
echo "🌐 Probando ruta principal /uplay:"
if curl -s --max-time 10 -I "$SUPERAPP_UPLAY_ENDPOINT" | grep -q "200 OK"; then
    echo "   ✅ /uplay accesible"
else
    echo "   ⚠️ /uplay podría no estar accesible directamente"
fi

# Probar una ruta de video específica (usaremos ID 1 basado en los datos del backend)
echo ""
echo "🎬 Probando ruta de video específico /uplay/video/1:"
VIDEO_ROUTE="$SUPERAPP_URL/uplay/video/1"
if curl -s --max-time 10 -I "$VIDEO_ROUTE" | grep -q "200 OK"; then
    echo "   ✅ Ruta de video específico accesible"
else
    echo "   ⚠️ Ruta de video específico podría no estar accesible directamente (normal para SPAs)"
fi

echo ""
echo "🔍 6. VERIFICANDO HOOK DE DATOS"
echo "==============================="

# Verificar useVideos hook
echo "🪝 Verificando hook useVideos:"
if [ -f "Demo/apps/superapp-unified/src/hooks/data/useVideoData.ts" ]; then
    echo "   ✅ useVideoData.ts existe"

    if grep -q "export.*useVideos" Demo/apps/superapp-unified/src/hooks/data/useVideoData.ts; then
        echo "   ✅ useVideos hook exportado"
    else
        echo "   ❌ useVideos hook NO exportado"
    fi

    if grep -q "adaptBackendVideoData" Demo/apps/superapp-unified/src/hooks/data/useVideoData.ts; then
        echo "   ✅ Adaptador de datos del backend implementado"
    else
        echo "   ❌ Adaptador de datos NO implementado"
    fi
else
    echo "   ❌ useVideoData.ts NO existe"
fi

echo ""
echo "🔍 7. VERIFICANDO INTEGRACIÓN EN INTERACTIVE LIBRARY"
echo "===================================================="

# Verificar que useVideos se usa en Interactive Library
echo "🔗 Verificando integración useVideos:"
if grep -q "useVideos" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx; then
    echo "   ✅ useVideos usado en UPlayInteractiveLibrary"
else
    echo "   ❌ useVideos NO usado en UPlayInteractiveLibrary"
fi

# Verificar procesamiento de videos
echo ""
echo "⚙️ Verificando procesamiento de videos:"
if grep -q "processedVideos" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx; then
    echo "   ✅ processedVideos implementado"
else
    echo "   ❌ processedVideos NO implementado"
fi

echo ""
echo "🔍 8. VERIFICANDO ESTRUCTURA DE DATOS"
echo "======================================"

# Verificar que el backend devuelve la estructura esperada
echo "📊 Verificando estructura de datos del backend:"
if command -v jq &> /dev/null; then
    FIRST_VIDEO=$(echo "$VIDEOS_RESPONSE" | jq '.[0]' 2>/dev/null)
    if echo "$FIRST_VIDEO" | jq -e '.id' > /dev/null 2>&1; then
        echo "   ✅ Campo 'id' presente"
    else
        echo "   ❌ Campo 'id' faltante"
    fi

    if echo "$FIRST_VIDEO" | jq -e '.title' > /dev/null 2>&1; then
        echo "   ✅ Campo 'title' presente"
    else
        echo "   ❌ Campo 'title' faltante"
    fi

    if echo "$FIRST_VIDEO" | jq -e '.externalId' > /dev/null 2>&1; then
        echo "   ✅ Campo 'externalId' presente (para YouTube)"
    else
        echo "   ❌ Campo 'externalId' faltante"
    fi
else
    echo "   ⚠️ jq no disponible - no se puede verificar estructura detallada"
fi

echo ""
echo "🎯 RESUMEN DE VERIFICACIÓN"
echo "=========================="

# Contador de verificaciones
TOTAL_CHECKS=8
PASSED_CHECKS=0

# Re-ejecutar verificaciones principales para el resumen
if curl -s --max-time 5 "$BACKEND_URL/health" > /dev/null; then
    ((PASSED_CHECKS++))
fi

if curl -s --max-time 5 -I "$SUPERAPP_URL" | grep -q "200 OK"; then
    ((PASSED_CHECKS++))
fi

if [ ! -z "$VIDEOS_RESPONSE" ]; then
    ((PASSED_CHECKS++))
fi

if grep -q "/uplay/video/:videoId" Demo/apps/superapp-unified/src/App.tsx; then
    ((PASSED_CHECKS++))
fi

if [ -f "Demo/apps/superapp-unified/src/pages/UPlayVideoPlayer.tsx" ]; then
    ((PASSED_CHECKS++))
fi

if grep -q "handleVideoClick" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx; then
    ((PASSED_CHECKS++))
fi

if grep -q "onClick.*handleVideoClick" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx; then
    ((PASSED_CHECKS++))
fi

if grep -q "useVideos" Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx; then
    ((PASSED_CHECKS++))
fi

echo "📊 Verificaciones: $PASSED_CHECKS/$TOTAL_CHECKS pasaron exitosamente"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo "🎉 ¡TODAS LAS VERIFICACIONES PASARON! El sistema de clicks debería funcionar."
    echo ""
    echo "📋 PASOS PARA PROBAR MANUALMENTE:"
    echo "1. Abrir http://localhost:3001/uplay en el navegador"
    echo "2. Verificar que los videos se muestran con miniaturas"
    echo "3. Hacer clic en cualquier video"
    echo "4. Verificar que navega a /uplay/video/[ID]"
    echo "5. Verificar que el reproductor se carga correctamente"
elif [ $PASSED_CHECKS -gt $((TOTAL_CHECKS / 2)) ]; then
    echo "⚠️ ALGUNAS VERIFICACIONES FALLARON. Revisar problemas específicos arriba."
else
    echo "❌ MÚLTIPLES VERIFICACIONES FALLARON. Sistema requiere atención."
fi

echo ""
echo "🔍 DEBUGGING ADICIONAL:"
echo "======================="
echo "- Verificar console.log en navegador al hacer clic en videos"
echo "- Revisar Network tab para calls de API"
echo "- Verificar que no hay errores de JavaScript bloqueando clicks"
echo "- Probar navegación manual: http://localhost:3001/uplay/video/1"

exit 0
