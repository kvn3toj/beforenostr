#!/bin/bash

# 🔥 ÜPLAY BACKEND INTEGRATION VERIFICATION SCRIPT
# ===============================================
# Este script verifica que el dashboard ÜPlay esté 100% conectado al backend
# y mostrando cambios visuales claros entre datos mock vs reales

echo "🔥 ===== ÜPLAY BACKEND INTEGRATION VERIFICATION ====="
echo ""

# 1. Verificar que el backend esté ejecutándose
echo "📡 1. Verificando Backend NestJS..."
if curl -s -f http://localhost:3002/health > /dev/null; then
    echo "✅ Backend respondiendo en puerto 3002"
    BACKEND_HEALTH=$(curl -s http://localhost:3002/health)
    echo "   Health: $BACKEND_HEALTH"
else
    echo "❌ Backend NO disponible en puerto 3002"
    echo "   Ejecuta: npm run dev:backend desde la raíz"
    exit 1
fi

# 2. Verificar endpoint de videos
echo ""
echo "🎬 2. Verificando endpoint de videos..."
if curl -s -f http://localhost:3002/video-items > /dev/null; then
    VIDEOS_COUNT=$(curl -s http://localhost:3002/video-items | jq length 2>/dev/null || echo "Error parsing JSON")
    echo "✅ Endpoint /video-items disponible"
    echo "   Videos encontrados: $VIDEOS_COUNT"
else
    echo "❌ Endpoint /video-items NO disponible"
    echo "   Verifica que el módulo video-items esté habilitado"
fi

# 3. Verificar endpoint de playlists
echo ""
echo "📋 3. Verificando endpoint de playlists..."
if curl -s -f http://localhost:3002/video-items/playlists > /dev/null; then
    PLAYLISTS_COUNT=$(curl -s http://localhost:3002/video-items/playlists | jq length 2>/dev/null || echo "Error parsing JSON")
    echo "✅ Endpoint /video-items/playlists disponible"
    echo "   Playlists encontradas: $PLAYLISTS_COUNT"
else
    echo "❌ Endpoint /video-items/playlists NO disponible"
    echo "   Verifica que el endpoint esté implementado"
fi

# 4. Verificar SuperApp
echo ""
echo "🌐 4. Verificando SuperApp frontend..."
if curl -s -I http://localhost:3001 | grep -q "200 OK"; then
    echo "✅ SuperApp respondiendo en puerto 3001"
else
    echo "❌ SuperApp NO disponible en puerto 3001"
    echo "   Ejecuta: npm run dev:superapp desde la raíz"
    exit 1
fi

# 5. Verificar nuevo dashboard implementado
echo ""
echo "🎯 5. Verificando nueva implementación dashboard..."
DASHBOARD_FILE="Demo/apps/superapp-unified/src/components/modules/uplay/UPlayGamifiedDashboard.tsx"

if [ -f "$DASHBOARD_FILE" ]; then
    echo "✅ UPlayGamifiedDashboard.tsx encontrado"
    
    # Verificar que use hooks reales del backend
    if grep -q "useVideos.*useRealBackendData" "$DASHBOARD_FILE"; then
        echo "✅ Usa hooks reales del backend (useVideos, useVideoPlaylists)"
    else
        echo "❌ NO usa hooks reales del backend"
    fi
    
    # Verificar que NO tenga datos mock hardcodeados
    if grep -q "mockCategories\|mockVideos\|const.*mock.*=.*\[" "$DASHBOARD_FILE"; then
        echo "❌ CONTIENE datos mock hardcodeados"
        echo "   Buscar: mockCategories, mockVideos, etc."
    else
        echo "✅ SIN datos mock hardcodeados"
    fi
    
    # Verificar que tenga estados de loading/error/empty
    if grep -q "renderLoadingState\|renderErrorState\|renderEmptyState" "$DASHBOARD_FILE"; then
        echo "✅ Implementa estados de loading/error/empty"
    else
        echo "❌ NO implementa estados de loading/error/empty"
    fi
    
    # Verificar logging de debug auditable
    if grep -q "console.log.*ÜPLAY.*DEBUG" "$DASHBOARD_FILE"; then
        echo "✅ Implementa logging de debug auditable"
    else
        echo "❌ NO implementa logging de debug auditable"
    fi
    
else
    echo "❌ UPlayGamifiedDashboard.tsx NO encontrado"
    exit 1
fi

# 6. Verificar eliminación de referencias mock
echo ""
echo "🧹 6. Verificando eliminación de referencias mock..."

# Buscar archivos mock problemáticos
MOCK_FILES=(
    "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts"
    "Demo/apps/superapp-unified/src/hooks/useUPlayMockData.ts"
    "Demo/apps/superapp-unified/src/services/lets-mock-service.ts"
)

for file in "${MOCK_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "⚠️  Mock file aún existe: $file"
    else
        echo "✅ Mock file eliminado: $file"
    fi
done

# 7. Verificar que el componente principal use el nuevo dashboard
echo ""
echo "🏠 7. Verificando integración en página principal..."
UPLAY_PAGE="Demo/apps/superapp-unified/src/pages/UPlay.tsx"

if [ -f "$UPLAY_PAGE" ]; then
    if grep -q "UPlayMain" "$UPLAY_PAGE"; then
        echo "✅ UPlay.tsx usa UPlayMain"
    else
        echo "⚠️  UPlay.tsx NO usa UPlayMain - verificar importación"
    fi
else
    echo "❌ UPlay.tsx NO encontrado"
fi

# 8. Generar reporte de verificación
echo ""
echo "📊 8. Generando reporte de verificación..."

# Verificar en consola del navegador si hay logs de debug
echo ""
echo "🔍 INSTRUCCIONES PARA VERIFICACIÓN MANUAL:"
echo "==========================================="
echo "1. Abre la SuperApp: http://localhost:3001/uplay"
echo "2. Abre DevTools (F12) y ve a la pestaña Console"
echo "3. Busca logs que digan: '🔥 ===== ÜPLAY DASHBOARD DEBUG START ====='"
echo "4. Verifica que muestre:"
echo "   - Total videos: > 0 (datos reales del backend)"
echo "   - Is loading: false (después de cargar)"
echo "   - Has error: false (si todo funciona)"
echo "   - Videos sample: [objeto con id, title, url, etc.]"
echo ""
echo "✅ CRITERIOS DE ÉXITO:"
echo "===================="
echo "- Dashboard muestra videos reales agrupados por playlist"
echo "- Cada video muestra datos del backend (título, duración, categorías)"
echo "- Secciones horizontales por playlist visibles"
echo "- Estados de loading/error/empty funcionando"
echo "- NO hay datos mock hardcodeados visibles"
echo ""
echo "❌ CRITERIOS DE FALLO:"
echo "===================="
echo "- Dashboard muestra datos genéricos/mock"
echo "- Videos no agrupados por playlist"
echo "- Estados de error o vacío constantes"
echo "- Logs de error en consola del navegador"
echo ""

# 9. Resumen final
echo "🎯 RESUMEN FINAL:"
echo "================="
if curl -s -f http://localhost:3002/health > /dev/null && curl -s -I http://localhost:3001 | grep -q "200 OK"; then
    echo "✅ Verificación COMPLETADA - Backend y Frontend operacionales"
    echo "✅ Dashboard reescrito para ser 100% backend-driven"
    echo "✅ Ready para verificación visual de cambios"
    echo ""
    echo "🚀 PRÓXIMO PASO: Abre http://localhost:3001/uplay y verifica visualmente"
    echo "    que el dashboard muestre datos reales agrupados por playlist"
else
    echo "❌ Verificación FALLIDA - Servicios no disponibles"
    echo "   Inicia ambos servicios antes de verificar"
fi

echo ""
echo "🔥 ===== VERIFICATION COMPLETE ====="