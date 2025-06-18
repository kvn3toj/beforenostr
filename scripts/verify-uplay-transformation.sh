#!/bin/bash

echo "🌌 VERIFICACIÓN COMPLETA DE TRANSFORMACIÓN UPLAY Y PATRONES"
echo "=========================================================="

# 🎯 1. Verificar archivos críticos existen
echo ""
echo "📂 1. VERIFICANDO EXISTENCIA DE ARCHIVOS CRÍTICOS:"

files_to_check=(
  "Demo/apps/superapp-unified/src/design-system/patterns.ts"
  "Demo/apps/superapp-unified/src/design-system/components/cosmic/CosmicCard.tsx"
  "Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx"
  "Demo/apps/superapp-unified/src/pages/UPlay.tsx"
  "Demo/apps/superapp-unified/src/components/modules/uplay/UPlayMobileHome.tsx"
)

for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - NO ENCONTRADO"
  fi
done

# 🔍 2. Verificar definición de revolutionaryPattern
echo ""
echo "🎨 2. VERIFICANDO DEFINICIÓN DE revolutionaryPattern:"

if grep -q "export const revolutionaryPattern = (theme: Theme) =>" Demo/apps/superapp-unified/src/design-system/patterns.ts; then
  echo "✅ revolutionaryPattern definido como función"
else
  echo "❌ revolutionaryPattern NO definido como función"
fi

# 🔍 3. Verificar uso correcto en CosmicCard
echo ""
echo "🌌 3. VERIFICANDO USO EN COSMICCARD:"

if grep -q "revolutionaryPattern(theme)" Demo/apps/superapp-unified/src/design-system/components/cosmic/CosmicCard.tsx; then
  echo "✅ CosmicCard usa revolutionaryPattern correctamente"
else
  echo "❌ CosmicCard NO usa revolutionaryPattern como función"
fi

# 🔍 4. Verificar uso en RevolutionaryWidget
echo ""
echo "🌟 4. VERIFICANDO USO EN REVOLUTIONARYWIDGET:"

if grep -q "componentVariants(theme)" Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx; then
  echo "✅ RevolutionaryWidget usa componentVariants(theme) correctamente"
else
  echo "❌ RevolutionaryWidget NO usa componentVariants como función"
fi

# 🌐 5. Verificar servicios están ejecutándose
echo ""
echo "🌐 5. VERIFICANDO SERVICIOS:"

# Verificar SuperApp
if curl -s http://localhost:2222 > /dev/null 2>&1; then
  echo "✅ SuperApp ejecutándose en http://localhost:2222"
else
  echo "⚠️ SuperApp NO disponible en puerto 3001"
fi

# Verificar Backend
if curl -s http://localhost:1111/health > /dev/null 2>&1; then
  echo "✅ Backend ejecutándose en http://localhost:1111"
else
  echo "⚠️ Backend NO disponible en puerto 3002"
fi

# 📄 6. Verificar página UPlay es accesible
echo ""
echo "📱 6. VERIFICANDO PÁGINA UPLAY:"

if curl -s http://localhost:2222/uplay > /dev/null 2>&1; then
  echo "✅ Página UPlay accesible"
else
  echo "⚠️ Página UPlay NO accesible"
fi

# 🏗️ 7. Test de compilación
echo ""
echo "🏗️ 7. VERIFICANDO COMPILACIÓN:"

cd Demo/apps/superapp-unified
if npm run build > /dev/null 2>&1; then
  echo "✅ Compilación exitosa - NO HAY ERRORES"
else
  echo "❌ Error en compilación"
  echo "📋 Ejecutando build con output detallado:"
  npm run build
fi

cd ../../../

# 🎯 8. Verificar estructura del Design System
echo ""
echo "🎨 8. VERIFICANDO ESTRUCTURA DESIGN SYSTEM:"

design_system_files=(
  "Demo/apps/superapp-unified/src/design-system/patterns.ts"
  "Demo/apps/superapp-unified/src/design-system/types.ts"
  "Demo/apps/superapp-unified/src/design-system/index.ts"
  "Demo/apps/superapp-unified/src/design-system/components/cosmic/CosmicCard.tsx"
  "Demo/apps/superapp-unified/src/design-system/templates/RevolutionaryWidget.tsx"
)

for file in "${design_system_files[@]}"; do
  if [ -f "$file" ]; then
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    echo "✅ $file (${size} bytes)"
  else
    echo "❌ $file - FALTA"
  fi
done

# 🔧 9. Verificar configuración de tipos
echo ""
echo "📋 9. VERIFICANDO CONFIGURACIÓN DE TIPOS:"

if grep -q "RevolutionaryPatternConfig" Demo/apps/superapp-unified/src/design-system/types.ts; then
  echo "✅ Tipos revolucionarios definidos"
else
  echo "⚠️ Tipos revolucionarios no encontrados"
fi

# 🎉 10. Resumen final
echo ""
echo "🎉 RESUMEN DE VERIFICACIÓN:"
echo "=========================="

# Contar verificaciones exitosas
total_checks=0
passed_checks=0

echo "📊 Puntuación de salud del sistema:"

if [ -f "Demo/apps/superapp-unified/src/design-system/patterns.ts" ]; then
  ((passed_checks++))
fi
((total_checks++))

if grep -q "revolutionaryPattern(theme)" Demo/apps/superapp-unified/src/design-system/components/cosmic/CosmicCard.tsx; then
  ((passed_checks++))
fi
((total_checks++))

if curl -s http://localhost:2222 > /dev/null 2>&1; then
  ((passed_checks++))
fi
((total_checks++))

score=$((passed_checks * 100 / total_checks))
echo "🏆 Puntuación: $passed_checks/$total_checks ($score%)"

if [ $score -ge 80 ]; then
  echo "🎊 ESTADO: EXCELENTE - Sistema funcionando correctamente"
elif [ $score -ge 60 ]; then
  echo "✅ ESTADO: BUENO - Funcional con mejoras menores"
elif [ $score -ge 40 ]; then
  echo "⚠️ ESTADO: ACEPTABLE - Requiere atención"
else
  echo "❌ ESTADO: CRÍTICO - Requiere corrección inmediata"
fi

echo ""
echo "🏁 VERIFICACIÓN COMPLETADA" 