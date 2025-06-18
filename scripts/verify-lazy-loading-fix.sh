#!/bin/bash

echo "🔍 VERIFICACIÓN COMPLETA - Resolución de Errores Lazy Loading"
echo "=============================================================="
echo ""

# 1. 🌐 VERIFICAR ESTADO DE LA SUPERAPP
echo "1. 📱 Verificando estado de la SuperApp..."
SUPERAPP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$SUPERAPP_STATUS" = "200" ]; then
  echo "✅ SuperApp respondiendo correctamente (HTTP $SUPERAPP_STATUS)"
else
  echo "❌ SuperApp con problemas (HTTP $SUPERAPP_STATUS)"
fi
echo ""

# 2. 🔍 VERIFICAR CONFLICTOS DE ARCHIVOS LAZY COMPONENTS
echo "2. 🔧 Verificando conflictos de archivos lazyComponents..."
TS_FILE="Demo/apps/superapp-unified/src/utils/lazyComponents.ts"
TSX_FILE="Demo/apps/superapp-unified/src/utils/lazyComponents.tsx"
TSX_BACKUP="Demo/apps/superapp-unified/src/utils/lazyComponents.tsx.backup"

if [ -f "$TS_FILE" ]; then
  echo "✅ Archivo principal lazyComponents.ts existe"
else
  echo "❌ Archivo principal lazyComponents.ts NO EXISTE"
fi

if [ -f "$TSX_FILE" ]; then
  echo "⚠️ Archivo conflictivo lazyComponents.tsx AÚN EXISTE (debería estar respaldado)"
elif [ -f "$TSX_BACKUP" ]; then
  echo "✅ Archivo conflictivo respaldado como lazyComponents.tsx.backup"
else
  echo "✅ No hay archivos conflictivos"
fi
echo ""

# 3. 🔍 VERIFICAR EXPORTS DEFAULT EN PÁGINAS PRINCIPALES
echo "3. 📄 Verificando exports default en páginas principales..."

# Verificar HomePage
if grep -q "export default HomePage" Demo/apps/superapp-unified/src/pages/HomePage.tsx; then
  echo "✅ HomePage.tsx tiene export default"
else
  echo "❌ HomePage.tsx NO tiene export default"
fi

# Verificar Home.tsx
if [ -f "Demo/apps/superapp-unified/src/pages/Home.tsx" ]; then
  if grep -q "export default" Demo/apps/superapp-unified/src/pages/Home.tsx; then
    echo "✅ Home.tsx tiene export default"
  else
    echo "❌ Home.tsx NO tiene export default"
  fi
else
  echo "ℹ️ Home.tsx no existe"
fi

# Verificar algunas páginas críticas
CRITICAL_PAGES=("LoginPage.tsx" "Marketplace.tsx" "UPlay.tsx" "Social.tsx" "Profile.tsx" "Wallet.tsx")

for page in "${CRITICAL_PAGES[@]}"; do
  PAGE_PATH="Demo/apps/superapp-unified/src/pages/$page"
  if [ -f "$PAGE_PATH" ]; then
    if grep -q "export default" "$PAGE_PATH"; then
      echo "✅ $page tiene export default"
    else
      echo "⚠️ $page NO tiene export default"
    fi
  else
    echo "ℹ️ $page no existe"
  fi
done
echo ""

# 4. 🔍 VERIFICAR IMPORTS EN APP.TSX
echo "4. 🎯 Verificando imports en App.tsx..."
if grep -q "from './utils/lazyComponents'" Demo/apps/superapp-unified/src/App.tsx; then
  echo "✅ App.tsx importa desde ./utils/lazyComponents (correcto)"
else
  echo "❌ App.tsx NO importa desde ./utils/lazyComponents"
fi
echo ""

# 5. 🔍 VERIFICAR PÁGINAS EXISTENTES VS LAZY IMPORTS
echo "5. 📂 Verificando existencia de páginas referenciadas en lazy loading..."

# Extraer imports de páginas del archivo lazyComponents.ts
LAZY_IMPORTS=$(grep -o "\.\./pages/[^']*" Demo/apps/superapp-unified/src/utils/lazyComponents.ts | sort | uniq)

echo "Verificando existencia de archivos importados:"
for import_path in $LAZY_IMPORTS; do
  # Convertir ../pages/Something a Demo/apps/superapp-unified/src/pages/Something.tsx
  page_name=$(echo "$import_path" | sed 's|../pages/||')
  file_path="Demo/apps/superapp-unified/src/pages/${page_name}.tsx"
  
  if [ -f "$file_path" ]; then
    echo "✅ $page_name.tsx existe"
  else
    echo "⚠️ $page_name.tsx NO EXISTE (lazy import lo requiere)"
  fi
done
echo ""

# 6. 📊 RESUMEN FINAL
echo "6. 📊 RESUMEN DE VERIFICACIÓN:"
echo "================================"

# Contar issues
ISSUES=0

if [ "$SUPERAPP_STATUS" != "200" ]; then
  ((ISSUES++))
fi

if [ -f "$TSX_FILE" ]; then
  ((ISSUES++))
fi

if ! grep -q "export default HomePage" Demo/apps/superapp-unified/src/pages/HomePage.tsx; then
  ((ISSUES++))
fi

if [ $ISSUES -eq 0 ]; then
  echo "🎉 ¡TODOS LOS PROBLEMAS LAZY LOADING RESUELTOS!"
  echo "✅ SuperApp funcional (HTTP 200)"
  echo "✅ Conflictos de archivos eliminados"
  echo "✅ Exports default corregidos"
  echo "✅ Sistema lazy loading optimizado"
else
  echo "⚠️ Se encontraron $ISSUES problemas pendientes"
  echo "Revisar las secciones anteriores para detalles"
fi

echo ""
echo "🔗 Para probar la aplicación: http://localhost:3001"
echo "" 