#!/bin/bash

# 🧹 SCRIPT DE LIMPIEZA MASIVA DE ARCHIVOS DEBUG
# Basado en mejores prácticas de git cleanup y debug file management
# Referencia: https://killtheradio.net/technology/debug-comments-or-how-to-save-your-sanity-using-git/

echo "🚨 INICIANDO LIMPIEZA MASIVA DE ARCHIVOS DEBUG..."
echo "📊 Análisis inicial..."

# Crear directorios de archivo si no existen
mkdir -p e2e-archive/debug-cleanup/{images,typescript,javascript,logs,maps,other}

# Contadores para reporte
count_images=0
count_ts=0
count_js=0
count_logs=0
count_maps=0
count_other=0

echo "🖼️ Archivando imágenes de debug..."
# Archivar imágenes PNG de debug
find . -name "*debug*.png" -type f | while read file; do
    if [[ -f "$file" ]]; then
        mv "$file" "e2e-archive/debug-cleanup/images/"
        ((count_images++))
    fi
done

echo "📝 Archivando archivos TypeScript de debug..."
# Archivar archivos TypeScript de debug
find . -name "*debug*.ts" -type f | while read file; do
    if [[ -f "$file" ]]; then
        mv "$file" "e2e-archive/debug-cleanup/typescript/"
        ((count_ts++))
    fi
done

echo "📄 Archivando archivos JavaScript de debug..."
# Archivar archivos JavaScript de debug
find . -name "*debug*.js" -type f | while read file; do
    if [[ -f "$file" ]]; then
        mv "$file" "e2e-archive/debug-cleanup/javascript/"
        ((count_js++))
    fi
done

echo "🗂️ Archivando archivos de log de debug..."
# Archivar archivos de log de debug
find . -name "*debug*.log" -type f | while read file; do
    if [[ -f "$file" ]]; then
        mv "$file" "e2e-archive/debug-cleanup/logs/"
        ((count_logs++))
    fi
done

echo "🗺️ Archivando source maps de debug..."
# Archivar source maps de debug
find . -name "*debug*.map" -type f | while read file; do
    if [[ -f "$file" ]]; then
        mv "$file" "e2e-archive/debug-cleanup/maps/"
        ((count_maps++))
    fi
done

echo "📦 Archivando otros archivos de debug..."
# Archivar otros tipos de archivos de debug
find . -name "*debug*" -type f ! -name "*.png" ! -name "*.ts" ! -name "*.js" ! -name "*.log" ! -name "*.map" | while read file; do
    if [[ -f "$file" ]]; then
        mv "$file" "e2e-archive/debug-cleanup/other/"
        ((count_other++))
    fi
done

echo ""
echo "✅ LIMPIEZA COMPLETADA!"
echo "📊 Resumen de archivos archivados:"
echo "   🖼️  Imágenes: $(ls e2e-archive/debug-cleanup/images/ 2>/dev/null | wc -l | tr -d ' ') archivos"
echo "   📝 TypeScript: $(ls e2e-archive/debug-cleanup/typescript/ 2>/dev/null | wc -l | tr -d ' ') archivos"
echo "   📄 JavaScript: $(ls e2e-archive/debug-cleanup/javascript/ 2>/dev/null | wc -l | tr -d ' ') archivos"
echo "   🗂️  Logs: $(ls e2e-archive/debug-cleanup/logs/ 2>/dev/null | wc -l | tr -d ' ') archivos"
echo "   🗺️  Maps: $(ls e2e-archive/debug-cleanup/maps/ 2>/dev/null | wc -l | tr -d ' ') archivos"
echo "   📦 Otros: $(ls e2e-archive/debug-cleanup/other/ 2>/dev/null | wc -l | tr -d ' ') archivos"
echo ""
echo "💾 Espacio liberado: $(du -sh e2e-archive/debug-cleanup/ | cut -f1)"
echo ""
echo "🎯 Verificación final..."
remaining_debug=$(find . -name "*debug*" -type f | wc -l | tr -d ' ')
echo "🔍 Archivos debug restantes: $remaining_debug"

if [ "$remaining_debug" -eq 0 ]; then
    echo "🎉 ¡LIMPIEZA PERFECTA! No quedan archivos de debug."
else
    echo "⚠️  Aún quedan $remaining_debug archivos de debug. Revisar manualmente."
fi

echo ""
echo "📋 Para eliminar permanentemente después de validación:"
echo "   rm -rf e2e-archive/debug-cleanup/"
echo ""
echo "🛡️ Para restaurar si es necesario:"
echo "   cp -r e2e-archive/debug-cleanup/* ./" 