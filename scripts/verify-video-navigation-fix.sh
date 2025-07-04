#!/bin/bash

echo "🎬 VERIFICACIÓN DE NAVEGACIÓN DE VIDEOS - UPLAY COOMUNITY"
echo "============================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

success_count=0
total_tests=8

check_item() {
    local description="$1"
    local command="$2"
    local success_pattern="$3"

    echo -n "🔍 $description... "

    if eval "$command" | grep -q "$success_pattern"; then
        echo -e "${GREEN}✅ EXITOSO${NC}"
        ((success_count++))
        return 0
    else
        echo -e "${RED}❌ FALLIDO${NC}"
        return 1
    fi
}

echo -e "${BLUE}📋 VERIFICACIONES DE INFRAESTRUCTURA${NC}"
echo "----------------------------------------"

# 1. Verificar que el backend esté ejecutándose
check_item "Backend NestJS operacional (puerto 3002)" \
    "curl -s http://localhost:3002/health" \
    "ok"

# 2. Verificar que la SuperApp esté ejecutándose
check_item "SuperApp operacional (puerto 3001)" \
    "curl -s -I http://localhost:3001" \
    "HTTP/1.1 200 OK"

# 3. Verificar datos de videos en el backend
check_item "Videos disponibles en backend" \
    "curl -s http://localhost:3002/video-items | jq 'length'" \
    "[1-9]"

echo ""
echo -e "${PURPLE}🎯 VERIFICACIONES DE DATOS DE VIDEO${NC}"
echo "----------------------------------------"

# 4. Verificar estructura de datos del backend
echo -n "📊 Estructura de datos del backend... "
VIDEO_SAMPLE=$(curl -s http://localhost:3002/video-items | jq '.[0]')
if echo "$VIDEO_SAMPLE" | jq -e '.externalId and .title and .duration and .thumbnailUrl' > /dev/null; then
    echo -e "${GREEN}✅ EXITOSO${NC}"
    ((success_count++))

    # Mostrar primer video para debugging
    echo -e "${YELLOW}📝 Primer video en backend:${NC}"
    echo "$VIDEO_SAMPLE" | jq '{id, title, externalId, duration, thumbnailUrl}'
else
    echo -e "${RED}❌ FALLIDO${NC}"
    echo "⚠️ Estructura de datos incompleta"
fi

echo ""
echo -e "${BLUE}🔧 VERIFICACIONES DE CÓDIGO ACTUALIZADO${NC}"
echo "----------------------------------------"

# 5. Verificar que la corrección de externalId esté aplicada
check_item "Corrección externalId en UPlayInteractiveLibrary" \
    "grep -n 'backendVideo.externalId' Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx" \
    "externalId"

# 6. Verificar que la corrección esté en UPlayVideoPlayer
check_item "Corrección externalId en UPlayVideoPlayer" \
    "grep -n 'videoExternalId.*externalId' Demo/apps/superapp-unified/src/pages/UPlayVideoPlayer.tsx" \
    "videoExternalId"

# 7. Verificar que handleVideoClick esté implementado
check_item "Función handleVideoClick implementada" \
    "grep -A 10 'handleVideoClick.*videoId' Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx" \
    "navigate"

echo ""
echo -e "${PURPLE}🎬 VERIFICACIÓN DE NAVEGACIÓN ESPECÍFICA${NC}"
echo "----------------------------------------"

# 8. Verificar que las rutas estén configuradas
check_item "Ruta /uplay/video/:videoId configurada" \
    "grep -n '/uplay/video/:videoId' Demo/apps/superapp-unified/src/App.tsx" \
    "UPlayVideoPlayer"

echo ""
echo "================================================================"
echo -e "${BLUE}📊 RESUMEN DE VERIFICACIÓN${NC}"
echo "================================================================"

if [ $success_count -eq $total_tests ]; then
    echo -e "${GREEN}🎉 TODAS LAS VERIFICACIONES EXITOSAS ($success_count/$total_tests)${NC}"
    echo ""
    echo -e "${GREEN}✅ RESOLUCIÓN COMPLETA DE NAVEGACIÓN DE VIDEOS${NC}"
    echo ""
    echo -e "${YELLOW}🎯 PRÓXIMOS PASOS PARA TESTING:${NC}"
    echo "1. Abrir http://localhost:3001/uplay en el navegador"
    echo "2. Verificar que se muestran videos con datos reales del backend"
    echo "3. Hacer clic en cualquier video para navegar al reproductor"
    echo "4. Verificar que el video se reproduce correctamente"
    echo "5. Verificar que los datos del video (título, descripción, duración) se muestran"
    echo ""
    echo -e "${PURPLE}🔍 COMANDO DE TESTING MANUAL:${NC}"
    echo "curl -s http://localhost:3002/video-items | jq '.[0:3] | .[].externalId'"
    echo ""
else
    echo -e "${RED}❌ VERIFICACIONES FALLIDAS: $((total_tests - success_count))/$total_tests${NC}"
    echo ""
    echo -e "${YELLOW}🔧 ELEMENTOS A REVISAR:${NC}"

    if ! curl -s http://localhost:3002/health | grep -q "ok"; then
        echo "- Iniciar el backend NestJS: npm run dev:backend"
    fi

    if ! curl -s -I http://localhost:3001 | grep -q "HTTP/1.1 200 OK"; then
        echo "- Iniciar la SuperApp: npm run dev:superapp"
    fi

    echo "- Verificar que los cambios de código se hayan aplicado correctamente"
    echo "- Revisar logs de consola para errores adicionales"
fi

echo ""
echo -e "${BLUE}🛠️ INFORMACIÓN DE DEBUG:${NC}"
echo "Archivos modificados en esta corrección:"
echo "- Demo/apps/superapp-unified/src/components/modules/uplay/UPlayInteractiveLibrary.tsx"
echo "- Demo/apps/superapp-unified/src/pages/UPlayVideoPlayer.tsx"
echo ""
echo "Cambios principales:"
echo "- Corregir backendVideo.youtubeVideoId → backendVideo.externalId"
echo "- Mejorar parsing de categories JSON"
echo "- Asegurar conversión correcta de IDs a strings"
echo "- Usar youtubeUrl del state en lugar de url genérica"

exit $((total_tests - success_count))
