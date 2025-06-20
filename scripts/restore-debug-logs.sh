#!/bin/bash

echo "🔧 RESTORING DEBUG LOGS FROM BACKUPS"
echo "===================================="

restored_count=0
failed_count=0

# Función para restaurar un archivo
restore_file() {
    local backup_file="$1"
    local original_file="${backup_file%.backup-logs}"

    if [ -f "$backup_file" ]; then
        echo "🔄 Restoring: $original_file"
        cp "$backup_file" "$original_file"
        if [ $? -eq 0 ]; then
            rm "$backup_file"
            ((restored_count++))
            echo "   ✅ Restored successfully"
        else
            ((failed_count++))
            echo "   ❌ Failed to restore"
        fi
    fi
}

# Buscar todos los archivos backup y restaurarlos
echo "🔍 Searching for backup files..."
find backend/src -name "*.backup-logs" -type f | while read backup_file; do
    restore_file "$backup_file"
done

echo ""
echo "📊 RESTORATION SUMMARY:"
echo "✅ Files restored: $restored_count"
echo "❌ Failed restorations: $failed_count"

if [ $restored_count -gt 0 ]; then
    echo ""
    echo "🚀 NEXT STEPS:"
    echo "1. Try starting backend: npm run dev:backend"
    echo "2. If it works, you can re-run a more careful log cleanup"
    echo "3. Or manually comment out specific debug lines"
else
    echo ""
    echo "ℹ️  No backup files found to restore"
    echo "💡 The files might have been already restored or cleaned differently"
fi

echo ""
echo "🔧 MANUAL CLEANUP ALTERNATIVE:"
echo "If you want to remove logs manually without breaking syntax:"
echo "1. Search for 'console.log.*>>>' in your IDE"
echo "2. Comment them out individually"
echo "3. Test the backend after each file to ensure no syntax errors"
