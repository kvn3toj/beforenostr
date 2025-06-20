#!/bin/bash
# Script de rollback para las mejoras UX

echo "🔄 Restaurando archivos originales..."

# Restaurar archivos desde backup
if [ -d "/Users/kevinp/Movies/Demo/data/backups/my_recovered_website/backup-20250603_122228" ]; then
    cp -r "/Users/kevinp/Movies/Demo/data/backups/my_recovered_website/backup-20250603_122228/sections/"* "sections/" 2>/dev/null || true
    echo "✅ Archivos restaurados desde /Users/kevinp/Movies/Demo/data/backups/my_recovered_website/backup-20250603_122228"
else
    echo "⚠️  Backup no encontrado. Restaurando desde archivos .backup individuales..."
    
    find . -name "*.backup" -type f | while read -r backup_file; do
        original_file="${backup_file%.backup}"
        cp "$backup_file" "$original_file"
        echo "Restaurado: $original_file"
    done
fi

echo "✅ Rollback completado"
echo "ℹ️  Los archivos compartidos en shared/ se mantienen para futuras implementaciones"
