#!/bin/bash

# 🚨 SCRIPT DE MIGRACIÓN DE ICONOS - SOLUCIÓN ANTI-EMFILE
# ========================================================
# Este script ayuda a migrar las importaciones de iconos MUI existentes
# al nuevo registro centralizado para prevenir errores EMFILE

echo "🔄 INICIANDO MIGRACIÓN DE ICONOS MUI..."
echo "======================================="

# Directorio base
SRC_DIR="src"

# Backup de archivos que serán modificados
echo "📋 Creando backup de archivos..."
find $SRC_DIR -name "*.tsx" -o -name "*.ts" | grep -E "from '@mui/icons-material'" | while read file; do
  cp "$file" "$file.backup"
  echo "  ✅ Backup: $file"
done

echo ""
echo "🔍 ANÁLISIS DE IMPORTACIONES ACTUALES:"
echo "======================================"

# Mostrar todas las importaciones de iconos
echo "📊 Archivos que importan iconos MUI:"
grep -r "from '@mui/icons-material'" $SRC_DIR/ | cut -d: -f1 | sort | uniq -c | sort -nr

echo ""
echo "📋 Iconos únicos importados:"
grep -rho "import.*from '@mui/icons-material'" $SRC_DIR/ | sed 's/.*{//; s/}.*//; s/,/\n/g' | sed 's/^ *//; s/ *$//' | sort | uniq | head -20

echo ""
echo "⚠️  INSTRUCCIONES MANUALES:"
echo "=========================="
echo "1. Revisa los iconos listados arriba"
echo "2. Asegúrate de que están en src/utils/iconRegistry.ts"
echo "3. Reemplaza las importaciones manuales:"
echo ""
echo "   ❌ ANTES:"
echo "   import { ErrorOutline, Refresh } from '@mui/icons-material';"
echo ""
echo "   ✅ DESPUÉS:"
echo "   import { useIcon } from '@/utils/iconRegistry';"
echo "   // En el componente:"
echo "   const ErrorOutlineIcon = useIcon('ErrorOutline');"
echo "   const RefreshIcon = useIcon('Refresh');"
echo ""
echo "4. O usa el componente Icon centralizado:"
echo "   import { Icon } from '@/utils/iconRegistry';"
echo "   // En JSX:"
echo "   <Icon name=\"ErrorOutline\" size=\"medium\" color=\"error\" />"
echo ""

# Crear un archivo de referencia con los iconos encontrados
echo "📝 Creando archivo de referencia..."
echo "// 🔍 ICONOS DETECTADOS EN EL CÓDIGO" > icons-detected.txt
echo "// Agrega estos al iconRegistry.ts si no están presentes" >> icons-detected.txt
echo "" >> icons-detected.txt
grep -rho "import.*from '@mui/icons-material'" $SRC_DIR/ | sed 's/.*{//; s/}.*//; s/,/\n/g' | sed 's/^ *//; s/ *$//' | sort | uniq >> icons-detected.txt

echo "✅ Archivo creado: icons-detected.txt"
echo ""
echo "🚀 PRÓXIMOS PASOS:"
echo "=================="
echo "1. Revisa icons-detected.txt"
echo "2. Actualiza iconRegistry.ts con iconos faltantes"
echo "3. Migra las importaciones manualmente"
echo "4. Prueba: npm run dev:superapp-only"
echo "5. Si funciona, elimina archivos .backup"
echo ""
echo "💡 TIP: Usa el registro centralizado para evitar EMFILE en el futuro"
