#!/bin/bash

echo "🧪 PRUEBA INMEDIATA: ÜPlay Video Functionality"
echo "=================================================="
echo

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 INSTRUCCIONES DE PRUEBA PASO A PASO${NC}"
echo "=============================================="
echo

echo -e "${YELLOW}PASO 1: Verificar que ambos servicios estén funcionando${NC}"
echo "🗄️ Backend NestJS:"
BACKEND_STATUS=$(curl -s http://localhost:3002/health)
if [[ $? -eq 0 ]]; then
    echo -e "   ✅ Backend funcionando: $BACKEND_STATUS"
else
    echo -e "   ❌ Backend no responde en puerto 3002"
    echo "   🔧 Ejecuta: npm run dev:backend"
    exit 1
fi

echo "🌐 SuperApp Frontend:"
FRONTEND_STATUS=$(curl -s -I http://localhost:3001 | head -1)
if [[ $? -eq 0 ]]; then
    echo -e "   ✅ Frontend funcionando: $FRONTEND_STATUS"
else
    echo -e "   ❌ Frontend no responde en puerto 3001"
    echo "   🔧 Ejecuta: npm run dev"
    exit 1
fi

echo
echo -e "${YELLOW}PASO 2: Verificar que hay videos en el backend${NC}"
VIDEOS_COUNT=$(curl -s http://localhost:3002/video-items | jq '. | length' 2>/dev/null || echo "N/A")
if [[ "$VIDEOS_COUNT" != "N/A" && "$VIDEOS_COUNT" -gt 0 ]]; then
    echo -e "   ✅ Backend tiene $VIDEOS_COUNT videos disponibles"
else
    echo -e "   ⚠️ No se pudieron contar los videos del backend"
fi

echo
echo -e "${YELLOW}PASO 3: Abrir la aplicación en el navegador${NC}"
echo "   📱 URL: http://localhost:3001/uplay"
echo "   🎯 Acción: Navegar a la sección de videos"

echo
echo -e "${YELLOW}PASO 4: Revisar la consola del navegador${NC}"
echo "   🛠️ Abrir DevTools (F12 o Cmd+Option+I)"
echo "   📊 Ir a la pestaña Console"
echo "   🔍 Buscar errores en rojo"

echo
echo -e "${YELLOW}PASO 5: Probar el click en un video${NC}"
echo "   🖱️ Hacer clic en cualquier tarjeta de video"
echo "   📝 Observar en la consola:"
echo "      - Debe aparecer: '🎯 Video seleccionado: [ID]'"
echo "      - Debe aparecer: '🎬 Datos del video encontrados: [objeto]'"
echo "   🧭 Verificar que la URL cambia a: /uplay/video/[ID]"

echo
echo -e "${YELLOW}PASO 6: Verificar navegación al reproductor${NC}"
echo "   🎬 Debe cargar el reproductor de video"
echo "   ▶️ Debe mostrar el video con controles"
echo "   📊 Debe mostrar información del video (título, descripción)"

echo
echo -e "${BLUE}🔍 PRUEBAS ADICIONALES SI LOS VIDEOS NO FUNCIONAN${NC}"
echo "=================================================="
echo

echo -e "${YELLOW}PRUEBA A: Navegación manual${NC}"
echo "   🌐 Ir directamente a: http://localhost:3001/uplay/video/1"
echo "   🎯 Si funciona → problema con el onClick"
echo "   ❌ Si no funciona → problema con el routing"

echo -e "${YELLOW}PRUEBA B: Verificar datos de API${NC}"
echo "   🔗 Abrir: http://localhost:3002/video-items"
echo "   📊 Debe mostrar JSON con array de videos"
echo "   🔍 Verificar que cada video tiene 'id', 'title', 'externalId'"

echo -e "${YELLOW}PRUEBA C: Revisar Network Tab${NC}"
echo "   🌐 En DevTools → Network tab"
echo "   🔄 Recargar /uplay"
echo "   🔍 Buscar llamada a 'video-items'"
echo "   ✅ Status debe ser 200"

echo -e "${YELLOW}PRUEBA D: Verificar errores de JavaScript${NC}"
echo "   🚨 Console tab → filtrar por 'Error'"
echo "   🔍 Buscar errores relacionados con:"
echo "      - 'Cannot read property of undefined'"
echo "      - 'handleVideoClick is not a function'"
echo "      - 'navigate is not defined'"

echo
echo -e "${GREEN}📧 REPORTAR RESULTADOS${NC}"
echo "======================"
echo "✅ Si funciona: ¡Perfecto! El problema estaba en los procesos múltiples"
echo "❌ Si no funciona: Reportar exactamente en qué paso falla"
echo "🔍 Incluir cualquier error de la consola del navegador"

echo
echo -e "${BLUE}🚀 ¡COMENZAR PRUEBA AHORA!${NC}"
echo "========================="
echo "Abre tu navegador en: http://localhost:3001/uplay"
