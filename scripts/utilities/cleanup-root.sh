#!/bin/bash

# 🧹 SCRIPT DE MANTENIMIENTO AUTOMÁTICO DEL DIRECTORIO RAÍZ
# Previene la acumulación de archivos temporales y de debug
# Basado en mejores prácticas de monorepo management

echo "🧹 INICIANDO LIMPIEZA AUTOMÁTICA DEL DIRECTORIO RAÍZ..."

# Navegar al directorio raíz del monorepo
cd "$(dirname "$0")/../.."

# Contadores para reporte
moved_files=0
deleted_files=0

echo "📊 Análisis inicial..."
initial_count=$(ls -la | grep "^-" | wc -l | tr -d ' ')
echo "   📁 Archivos en raíz: $initial_count"

# Crear directorios si no existen
mkdir -p docs/{reports,accessibility,implementation,testing}
mkdir -p scripts/{analysis,fixes,utilities,database}
mkdir -p assets/{images,screenshots,temp}
mkdir -p config/{archived,backup}

echo "🗂️ Organizando archivos por categoría..."

# Mover documentación
if ls *.md >/dev/null 2>&1; then
    for file in *.md; do
        if [[ "$file" != "README.md" && "$file" != "PROJECT_STRUCTURE.md" ]]; then
            if [[ "$file" == *"ACCESSIBILITY"* || "$file" == *"accessibility"* ]]; then
                mv "$file" docs/accessibility/
            elif [[ "$file" == *"TEST"* || "$file" == *"E2E"* ]]; then
                mv "$file" docs/testing/
            elif [[ "$file" == *"IMPLEMENTATION"* ]]; then
                mv "$file" docs/implementation/
            else
                mv "$file" docs/reports/
            fi
            ((moved_files++))
        fi
    done
fi

# Mover scripts
if ls *.js >/dev/null 2>&1; then
    for file in *.js; do
        if [[ "$file" == analyze-* || "$file" == audit-* ]]; then
            mv "$file" scripts/analysis/
        elif [[ "$file" == apply-* || "$file" == fix-* ]]; then
            mv "$file" scripts/fixes/
        else
            mv "$file" scripts/utilities/
        fi
        ((moved_files++))
    done
fi

# Mover archivos de texto
if ls *.txt >/dev/null 2>&1; then
    mv *.txt docs/reports/
    moved_files=$((moved_files + $(ls docs/reports/*.txt 2>/dev/null | wc -l | tr -d ' ')))
fi

# Mover imágenes
if ls *.png >/dev/null 2>&1; then
    mv *.png assets/screenshots/
    moved_files=$((moved_files + $(ls assets/screenshots/*.png 2>/dev/null | wc -l | tr -d ' ')))
fi

if ls *.jpg >/dev/null 2>&1; then
    mv *.jpg assets/screenshots/
    moved_files=$((moved_files + $(ls assets/screenshots/*.jpg 2>/dev/null | wc -l | tr -d ' ')))
fi

# Mover archivos JSON (reportes)
if ls *-report-*.json >/dev/null 2>&1; then
    mv *-report-*.json config/archived/
    moved_files=$((moved_files + $(ls config/archived/*-report-*.json 2>/dev/null | wc -l | tr -d ' ')))
fi

# Limpiar archivos temporales antiguos (más de 14 días)
echo "🗑️ Eliminando archivos temporales antiguos..."
find assets/temp/ -name "*.png" -mtime +14 -delete 2>/dev/null
find config/archived/ -name "*.json" -mtime +30 -delete 2>/dev/null
find docs/reports/ -name "*debug*" -mtime +7 -delete 2>/dev/null

echo "✅ LIMPIEZA COMPLETADA"
echo ""
echo "📊 RESUMEN:"
echo "   🗂️ Archivos organizados: $moved_files"
echo "   🗑️ Archivos eliminados: $deleted_files"

final_count=$(ls -la | grep "^-" | wc -l | tr -d ' ')
echo "   📁 Archivos en raíz después: $final_count"

reduction=$((initial_count - final_count))
if [ $reduction -gt 0 ]; then
    echo "   📈 Reducción: $reduction archivos"
else
    echo "   ✅ Directorio ya estaba limpio"
fi

echo ""
echo "🎯 Para ejecutar automáticamente cada semana:"
echo "   crontab -e"
echo "   0 0 * * 0 /path/to/this/script/cleanup-root.sh" 