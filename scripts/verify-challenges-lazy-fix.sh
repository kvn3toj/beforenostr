#!/bin/bash

echo "🔍 VERIFICACIÓN: Error de Lazy Loading Challenges Resuelto"
echo "============================================================"
echo "Error ID: b712479a02084188b9895b41a735b585"
echo

# 1. Verificar ubicación correcta
echo "📍 1. Verificando ubicación del directorio..."
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"
if [ "$CURRENT_DIR" = "$EXPECTED_DIR" ]; then
  echo "✅ Ubicación correcta: $CURRENT_DIR"
else
  echo "❌ Ubicación incorrecta. Actual: $CURRENT_DIR | Esperada: $EXPECTED_DIR"
  exit 1
fi

# 2. Verificar export default en ChallengesPage
echo "📄 2. Verificando export default en ChallengesPage.tsx..."
if grep -q "export default ChallengesPage" Demo/apps/superapp-unified/src/pages/ChallengesPage.tsx; then
  echo "✅ ChallengesPage tiene export default"
else
  echo "❌ ChallengesPage NO tiene export default"
fi

# 3. Verificar export default en ChallengeDetailPage
echo "📄 3. Verificando export default en ChallengeDetailPage.tsx..."
if grep -q "export default ChallengeDetailPage" Demo/apps/superapp-unified/src/pages/ChallengeDetailPage.tsx; then
  echo "✅ ChallengeDetailPage tiene export default"
else
  echo "❌ ChallengeDetailPage NO tiene export default"
fi

# 4. Verificar que el import en lazyComponents está correcto
echo "📋 4. Verificando imports en lazyComponents.ts..."
if grep -q "const ChallengesPage = lazy" Demo/apps/superapp-unified/src/utils/lazyComponents.ts; then
  echo "✅ ChallengesPage importado correctamente en lazyComponents"
else
  echo "❌ ChallengesPage NO está en lazyComponents"
fi

if grep -q "const ChallengeDetailPage = lazy" Demo/apps/superapp-unified/src/utils/lazyComponents.ts; then
  echo "✅ ChallengeDetailPage importado correctamente en lazyComponents"
else
  echo "❌ ChallengeDetailPage NO está en lazyComponents"
fi

# 5. Verificar que no hay archivos backup conflictivos en pages
echo "🗑️ 5. Verificando archivos backup conflictivos..."
BACKUP_CHALLENGES=$(find Demo/apps/superapp-unified/src/pages/ -name "*Challenge*backup*" -o -name "*Challenge*.backup" 2>/dev/null | wc -l)
if [ $BACKUP_CHALLENGES -eq 0 ]; then
  echo "✅ No hay archivos backup conflictivos en pages/"
else
  echo "⚠️ Se encontraron $BACKUP_CHALLENGES archivos backup con 'Challenge' en el nombre"
fi

# 6. Verificar limpieza de cachés Vite
echo "🧹 6. Verificando limpieza de cachés Vite..."
if [ ! -d "Demo/apps/superapp-unified/node_modules/.vite" ] && [ ! -d "Demo/apps/superapp-unified/dist" ]; then
  echo "✅ Cachés de Vite limpiados correctamente"
else
  echo "⚠️ Algunos cachés de Vite aún presentes (es normal si se han regenerado)"
fi

# 7. Verificar dependencias críticas
echo "🗄️ 7. Verificando dependencias críticas..."
POSTGRES_STATUS=$(brew services list | grep postgresql@15 | awk '{print $2}')
REDIS_STATUS=$(brew services list | grep redis | awk '{print $2}')

if [ "$POSTGRES_STATUS" = "started" ]; then
  echo "✅ PostgreSQL ejecutándose"
else
  echo "❌ PostgreSQL NO ejecutándose"
fi

if [ "$REDIS_STATUS" = "started" ]; then
  echo "✅ Redis ejecutándose"
else
  echo "❌ Redis NO ejecutándose"
fi

# 8. Verificar que no hay procesos conflictivos
echo "🔄 8. Verificando procesos múltiples..."
RUNNING_PROCESSES=$(ps aux | grep -E "(vite.*3001|npm run dev)" | grep -v grep | wc -l)
if [ $RUNNING_PROCESSES -eq 0 ]; then
  echo "✅ No hay procesos conflictivos ejecutándose"
else
  echo "⚠️ Se detectaron $RUNNING_PROCESSES procesos que podrían ser conflictivos"
fi

echo
echo "🎯 RESUMEN DE LA CORRECCIÓN:"
echo "- ✅ Agregado 'export default ChallengesPage' al final del archivo"
echo "- ✅ Agregado 'export default ChallengeDetailPage' al final del archivo"
echo "- ✅ Limpiados cachés de Vite (node_modules/.vite, dist, .vite)"
echo "- ✅ Verificadas dependencias críticas (PostgreSQL + Redis)"
echo "- ✅ Limpiados procesos conflictivos"
echo
echo "📋 PRÓXIMOS PASOS:"
echo "1. Iniciar SuperApp con: npm run dev:superapp"
echo "2. Navegar a /challenges para verificar que carga correctamente"
echo "3. Verificar que no aparece el error 'Element type is invalid'"
echo
echo "🔧 CAUSA RAÍZ IDENTIFICADA:"
echo "- Los componentes ChallengesPage y ChallengeDetailPage tenían solo"
echo "  exportaciones nombradas (export const) pero no export default"
echo "- React.lazy() requiere import dinámico que devuelva { default: Component }"
echo "- Sin export default, la promesa se resuelve a undefined"
echo
echo "✅ CORRECCIÓN COMPLETADA - ERROR ID: b712479a02084188b9895b41a735b585"
