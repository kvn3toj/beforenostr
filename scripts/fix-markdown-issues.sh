#!/bin/bash

# Script para corregir problemas comunes en archivos Markdown
# Ejecutar desde la raíz del proyecto: bash scripts/fix-markdown-issues.sh

echo "🔧 Iniciando corrección de problemas en archivos Markdown..."

# Función para corregir problemas comunes
fix_markdown_file() {
    local file="$1"
    echo "Procesando: $file"
    
    # Crear backup
    cp "$file" "${file}.backup"
    
    # Corregir líneas en blanco múltiples (reducir a máximo 2)
    sed -i.tmp '/^$/N;/^\n$/d' "$file"
    
    # Corregir espacios al final de líneas
    sed -i.tmp 's/[[:space:]]*$//' "$file"
    
    # Asegurar línea final vacía
    echo "" >> "$file"
    
    # Limpiar archivos temporales
    rm -f "${file}.tmp"
    
    echo "✅ Corregido: $file"
}

# Directorios a procesar (excluyendo algunos problemáticos)
DIRS_TO_PROCESS=(
    "Demo/apps/superapp-unified"
    "docs"
)

# Contadores
TOTAL_FILES=0
PROCESSED_FILES=0

# Procesar archivos en los directorios especificados
for dir in "${DIRS_TO_PROCESS[@]}"; do
    if [ -d "$dir" ]; then
        echo "📁 Procesando directorio: $dir"
        
        # Encontrar archivos .md, excluyendo algunos patrones
        while IFS= read -r -d '' file; do
            # Excluir archivos específicos
            if [[ "$file" == *"node_modules"* ]] || \
               [[ "$file" == *"_temp_"* ]] || \
               [[ "$file" == *"backup"* ]] || \
               [[ "$file" == *"test-results"* ]] || \
               [[ "$file" == *"playwright-report"* ]]; then
                continue
            fi
            
            TOTAL_FILES=$((TOTAL_FILES + 1))
            
            # Solo procesar archivos que no sean demasiado grandes (< 1MB)
            if [ -f "$file" ] && [ $(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0) -lt 1048576 ]; then
                fix_markdown_file "$file"
                PROCESSED_FILES=$((PROCESSED_FILES + 1))
            else
                echo "⚠️  Omitido (muy grande): $file"
            fi
            
        done < <(find "$dir" -name "*.md" -type f -print0 2>/dev/null)
    else
        echo "⚠️  Directorio no encontrado: $dir"
    fi
done

echo ""
echo "📊 Resumen:"
echo "   Total archivos encontrados: $TOTAL_FILES"
echo "   Archivos procesados: $PROCESSED_FILES"
echo ""

# Ofrecer limpiar backups
echo "🗑️  ¿Deseas eliminar los archivos de backup generados? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    find . -name "*.md.backup" -type f -delete 2>/dev/null
    echo "✅ Archivos de backup eliminados"
else
    echo "📁 Archivos de backup conservados (*.md.backup)"
fi

echo ""
echo "✅ Corrección de archivos Markdown completada!"
echo ""
echo "📋 Próximos pasos recomendados:"
echo "   1. Reinicia Cursor/VSCode para aplicar configuraciones"
echo "   2. Verifica la pestaña Problems para confirmar reducción de advertencias"
echo "   3. Si persisten problemas, revisa archivos específicos manualmente" 