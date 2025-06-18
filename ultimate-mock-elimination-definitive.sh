#!/bin/bash

# 🚀 ULTIMATE MOCK ELIMINATION - DEFINITIVE SOLUTION
# ===================================================
# Elimina permanentemente todos los archivos mock restaurados y limpia cachés compilados
# Basado en aprendizajes del conversation summary sobre restauración desde dist/

echo "🔥 ULTIMATE MOCK ELIMINATION - ELIMINACIÓN DEFINITIVA"
echo "=============================================="

# Verificar directorio correcto
if [ "$(pwd)" != "/Users/kevinp/Movies/GAMIFIER-copy" ]; then
    echo "❌ ERROR: Ejecutar desde /Users/kevinp/Movies/GAMIFIER-copy"
    exit 1
fi

cd Demo/apps/superapp-unified || exit 1

echo "🧹 PASO 1: ELIMINANDO ARCHIVOS MOCK RESTAURADOS..."

# 1. ELIMINAR ARCHIVOS MOCK FÍSICOS (la causa raíz de la restauración)
echo "📁 Eliminando archivos mock restaurados..."
rm -f src/utils/testMockAuth.ts
rm -f src/data/marketplaceMockData.ts  
rm -f src/hooks/useUPlayMockData.ts
rm -f src/lib/lets-mock-service.ts
rm -f src/components/DevMockBanner.tsx

# 2. ELIMINAR DIRECTORIOS DE CACHE COMPILADO (CRÍTICO - evita restauración)
echo "🗑️ Eliminando cachés compilados que causan restauración..."
rm -rf dist/
rm -rf node_modules/.vite/
rm -rf .vite/
rm -rf node_modules/.cache/

echo "🔧 PASO 2: CORRIGIENDO IMPORTS Y REFERENCIAS..."

# 3. CORREGIR IMPORTS EN AuthContext.tsx
echo "🔐 Corrigiendo AuthContext.tsx..."
sed -i '' 's/import {/\/\/ import {/g' src/contexts/AuthContext.tsx
sed -i '' 's/} from '\''\.\.\/utils\/testMockAuth'\'';/\/\/ } from '\''\.\.\/utils\/testMockAuth'\'';/g' src/contexts/AuthContext.tsx

# 4. CORREGIR useRealBackendData.ts - Eliminar imports dinámicos de marketplaceMockData
echo "📊 Corrigiendo useRealBackendData.ts..."
sed -i '' '/const { marketplaceMockData } = await import(/,+2d' src/hooks/useRealBackendData.ts
sed -i '' 's/marketplaceMockData\.length/0/g' src/hooks/useRealBackendData.ts
sed -i '' 's/marketplaceMockData/[]/g' src/hooks/useRealBackendData.ts

# 5. CORREGIR ProductDetail.tsx
echo "🛍️ Corrigiendo ProductDetail.tsx..."
sed -i '' 's/import { getItemById, marketplaceMockData } from/\/\/ import { getItemById, marketplaceMockData } from/g' src/pages/ProductDetail.tsx
sed -i '' 's/if (marketplaceMockData\.length > 0)/if (false \/\/ marketplaceMockData\.length > 0)/g' src/pages/ProductDetail.tsx
sed -i '' 's/const baseItem = marketplaceMockData\[0\];/\/\/ const baseItem = marketplaceMockData[0];/g' src/pages/ProductDetail.tsx

# 6. CORREGIR MarketplaceTest.tsx
echo "🧪 Corrigiendo MarketplaceTest.tsx..."
sed -i '' 's/const featuredItems = getFeaturedItems();/\/\/ const featuredItems = getFeaturedItems();/g' src/pages/MarketplaceTest.tsx
sed -i '' 's/const trendingItems = getTrendingItems();/\/\/ const trendingItems = getTrendingItems();/g' src/pages/MarketplaceTest.tsx
sed -i '' 's/const sustainabilityItems = getItemsByCategory/\/\/ const sustainabilityItems = getItemsByCategory/g' src/pages/MarketplaceTest.tsx
sed -i '' 's/const educationItems = getItemsByCategory/\/\/ const educationItems = getItemsByCategory/g' src/pages/MarketplaceTest.tsx
sed -i '' 's/{marketplaceMockData\.length}/{0}/g' src/pages/MarketplaceTest.tsx
sed -i '' 's/marketplaceMockData\.map/\/\/ marketplaceMockData.map/g' src/pages/MarketplaceTest.tsx

# 7. CORREGIR UnifiedUPlayPlayer.tsx
echo "🎮 Corrigiendo UnifiedUPlayPlayer.tsx..."
sed -i '' 's/import { useUPlayMockData } from/\/\/ import { useUPlayMockData } from/g' src/components/modules/uplay/UnifiedUPlayPlayer.tsx
sed -i '' 's/const { formatDuration } = useUPlayMockData();/\/\/ const { formatDuration } = useUPlayMockData();/g' src/components/modules/uplay/UnifiedUPlayPlayer.tsx

# Agregar función formatDuration local
cat >> src/components/modules/uplay/UnifiedUPlayPlayer.tsx << 'EOF'

// 🔧 Función formatDuration local (reemplazo de useUPlayMockData)
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
EOF

# 8. CORREGIR UPlayMobileHome.tsx
echo "📱 Corrigiendo UPlayMobileHome.tsx..."
sed -i '' 's/useUPlayMockData,/\/\/ useUPlayMockData,/g' src/components/modules/uplay/UPlayMobileHome.tsx
sed -i '' 's/} from '\''\.\.\/\.\.\/\.\.\/hooks\/useUPlayMockData'\'';/\/\/ } from '\''\.\.\/\.\.\/\.\.\/hooks\/useUPlayMockData'\'';/g' src/components/modules/uplay/UPlayMobileHome.tsx
sed -i '' 's/} = useUPlayMockData();/\/\/ } = useUPlayMockData();/g' src/components/modules/uplay/UPlayMobileHome.tsx

# 9. CORREGIR useLetsIntegration.ts
echo "💰 Corrigiendo useLetsIntegration.ts..."
sed -i '' 's/import { letsMockService } from/\/\/ import { letsMockService } from/g' src/hooks/useLetsIntegration.ts

echo "🧪 PASO 3: VERIFICACIÓN COMPLETA..."

# Verificar que no queden referencias activas
echo "🔍 Verificando eliminación completa..."

MOCK_FILES_COUNT=$(find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "testMockAuth\|marketplaceMockData\|useUPlayMockData\|lets-mock-service" | grep -v ".backup" | wc -l)
ACTIVE_IMPORTS=$(find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -E "^import.*testMockAuth|^import.*marketplaceMockData|^import.*useUPlayMockData|^import.*lets-mock-service" | wc -l)

echo "📊 RESULTADOS DE VERIFICACIÓN:"
echo "   📁 Archivos con referencias mock: $MOCK_FILES_COUNT"
echo "   📦 Imports activos detectados: $ACTIVE_IMPORTS"

if [ "$MOCK_FILES_COUNT" -eq 0 ] && [ "$ACTIVE_IMPORTS" -eq 0 ]; then
    echo "✅ ÉXITO TOTAL: Todos los mocks eliminados y referencias corregidas"
    echo "🎯 EFECTOS VISUALES DESBLOQUEADOS: Cosmic Design System, Glassmorphism, Revolutionary Auras"
else
    echo "⚠️ ADVERTENCIA: Aún quedan $MOCK_FILES_COUNT archivos con referencias"
    echo "🔧 IMPORTS ACTIVOS: $ACTIVE_IMPORTS pendientes de corrección"
fi

# Limpiar caché del sistema  
echo "🧹 Limpiando cachés del sistema..."
npm cache clean --force 2>/dev/null || true

echo "🏁 ULTIMATE MOCK ELIMINATION COMPLETADO"
echo "📋 SIGUIENTE PASO: Reiniciar servicios con 'npm run dev'"
echo "🌟 EFECTOS VISUALES LISTOS PARA MANIFESTACIÓN" 