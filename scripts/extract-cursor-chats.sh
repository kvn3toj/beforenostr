#!/bin/bash

# 🎯 SCRIPT DE EXTRACCIÓN DE CHATS NATIVOS DE CURSOR
# Para el proyecto CoomÜnity - GAMIFIER-copy

echo "🤖 EXTRACTOR DE CHATS NATIVOS DE CURSOR - PROYECTO COOMUNITY"
echo "============================================================="
echo ""

DB_PATH="/Users/kevinp/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
OUTPUT_DIR="logs/cursor-chats"

if [ ! -f "$DB_PATH" ]; then
    echo "❌ Error: No se encontró la base de datos de Cursor"
    echo "📍 Esperado en: $DB_PATH"
    exit 1
fi

echo "📋 BASE DE DATOS ENCONTRADA:"
echo "📁 Ubicación: $DB_PATH"
echo "📊 Tamaño: $(du -h "$DB_PATH" | cut -f1)"
echo "🕒 Última modificación: $(stat -f "%Sm" "$DB_PATH")"
echo ""

# Crear directorio de salida
mkdir -p "$OUTPUT_DIR"

echo "🔍 EXTRAYENDO CHATS DE BACKGROUND COMPOSER..."

# Obtener número total de chats
TOTAL_COMPOSER=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM cursorDiskKV WHERE key LIKE 'backgroundComposerModalInputData:%';")
echo "📊 Total de chats de composer encontrados: $TOTAL_COMPOSER"

echo ""
echo "📝 CHATS MÁS RECIENTES (últimos 10):"
echo "===================================="

# Extraer chats de composer más recientes
sqlite3 "$DB_PATH" "
SELECT 
    substr(key, length('backgroundComposerModalInputData:') + 1) as chat_id,
    json_extract(value, '$.composerData.createdAt') as created_timestamp,
    substr(json_extract(value, '$.composerData.text'), 1, 200) || '...' as preview
FROM cursorDiskKV 
WHERE key LIKE 'backgroundComposerModalInputData:%' 
ORDER BY json_extract(value, '$.composerData.createdAt') DESC 
LIMIT 10;" | while IFS='|' read -r chat_id timestamp preview; do
    
    # Convertir timestamp a fecha legible
    if [[ "$timestamp" != "" && "$timestamp" != "null" ]]; then
        readable_date=$(date -r $((timestamp / 1000)) "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "Fecha inválida")
    else
        readable_date="Fecha no disponible"
    fi
    
    echo ""
    echo "🗨️  Chat ID: $chat_id"
    echo "📅 Fecha: $readable_date"
    echo "💬 Vista previa: $preview"
    echo "----------------------------------------"
done

echo ""
echo "💾 GUARDANDO CHATS COMPLETOS..."

# Extraer chats completos en archivos individuales
counter=1
sqlite3 "$DB_PATH" "
SELECT 
    substr(key, length('backgroundComposerModalInputData:') + 1) as chat_id,
    json_extract(value, '$.composerData.createdAt') as created_timestamp,
    json_extract(value, '$.composerData.text') as full_text
FROM cursorDiskKV 
WHERE key LIKE 'backgroundComposerModalInputData:%' 
ORDER BY json_extract(value, '$.composerData.createdAt') DESC;" | while IFS='|' read -r chat_id timestamp full_text; do
    
    if [[ "$timestamp" != "" && "$timestamp" != "null" ]]; then
        readable_date=$(date -r $((timestamp / 1000)) "+%Y%m%d_%H%M%S" 2>/dev/null || echo "unknown")
        filename="${OUTPUT_DIR}/chat_${counter}_${readable_date}_${chat_id:0:8}.txt"
    else
        filename="${OUTPUT_DIR}/chat_${counter}_unknown_${chat_id:0:8}.txt"
    fi
    
    # Crear archivo con el chat completo
    {
        echo "=== CHAT NATIVO DE CURSOR ==="
        echo "ID: $chat_id"
        echo "Timestamp: $timestamp"
        if [[ "$timestamp" != "" && "$timestamp" != "null" ]]; then
            echo "Fecha: $(date -r $((timestamp / 1000)) "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "Fecha inválida")"
        fi
        echo "Proyecto: CoomÜnity"
        echo "==============================="
        echo ""
        echo "$full_text"
    } > "$filename"
    
    echo "✅ Chat $counter guardado: $filename"
    counter=$((counter + 1))
    
    # Limitar a los 20 más recientes
    if [ $counter -gt 20 ]; then
        break
    fi
done

echo ""
echo "🎉 EXTRACCIÓN COMPLETADA!"
echo "📁 Chats guardados en: $OUTPUT_DIR"
echo "📊 Total procesados: $((counter - 1)) chats"
echo ""
echo "🔍 Para ver un chat específico:"
echo "   cat $OUTPUT_DIR/chat_1_*.txt"
echo ""
echo "📋 Para listar todos los archivos:"
echo "   ls -la $OUTPUT_DIR/" 