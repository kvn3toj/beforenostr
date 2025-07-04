#!/bin/bash

# 🎯 SCRIPT DE ACCESO RÁPIDO A CHATS DE CLAUDE DEV
# Para el proyecto CoomÜnity - GAMIFIER-copy

echo "🤖 ACCESO A CHATS DE CLAUDE DEV - PROYECTO COOMUNITY"
echo "=================================================="
echo ""

CHAT_DIR="/Users/kevinp/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/tasks"

if [ ! -d "$CHAT_DIR" ]; then
    echo "❌ Error: No se encontró el directorio de chats de Claude Dev"
    echo "📍 Esperado en: $CHAT_DIR"
    exit 1
fi

echo "📋 CONVERSACIONES DISPONIBLES (ordenadas por fecha):"
echo ""

# Listar las 10 conversaciones más recientes
ls -lt "$CHAT_DIR" | head -11 | tail -10 | while IFS= read -r line; do
    if [[ $line == d* ]]; then
        # Extraer fecha y ID de la conversación
        date_part=$(echo "$line" | awk '{print $6, $7, $8}')
        chat_id=$(echo "$line" | awk '{print $9}')
        echo "📅 $date_part - ID: $chat_id"
    fi
done

echo ""
echo "🔧 OPCIONES:"
echo "1) Abrir conversación más reciente"
echo "2) Abrir carpeta de todas las conversaciones"  
echo "3) Listar archivos de una conversación específica"
echo "4) Activar Claude Dev en Cursor"
echo ""

read -p "Seleccione una opción (1-4): " option

case $option in
    1)
        # Abrir la conversación más reciente
        most_recent=$(ls -t "$CHAT_DIR" | head -1)
        if [ -n "$most_recent" ]; then
            echo "📖 Abriendo conversación más reciente: $most_recent"
            open "$CHAT_DIR/$most_recent/api_conversation_history.json"
        else
            echo "❌ No se encontraron conversaciones"
        fi
        ;;
    2)
        echo "📁 Abriendo carpeta de conversaciones..."
        open "$CHAT_DIR"
        ;;
    3)
        echo "📋 Conversaciones disponibles:"
        ls -t "$CHAT_DIR" | head -5
        echo ""
        read -p "Ingrese el ID de la conversación: " chat_id
        if [ -d "$CHAT_DIR/$chat_id" ]; then
            echo "📄 Archivos en la conversación $chat_id:"
            ls -la "$CHAT_DIR/$chat_id/"
            echo ""
            read -p "¿Abrir api_conversation_history.json? (y/n): " open_file
            if [ "$open_file" = "y" ]; then
                open "$CHAT_DIR/$chat_id/api_conversation_history.json"
            fi
        else
            echo "❌ No se encontró la conversación con ID: $chat_id"
        fi
        ;;
    4)
        echo "🚀 Para activar Claude Dev en Cursor:"
        echo ""
        echo "1. Abra Cursor"
        echo "2. Presione Cmd + Shift + P"
        echo "3. Escriba 'Claude Dev'"
        echo "4. Seleccione 'Claude Dev: Start New Task'"
        echo ""
        echo "Si no aparece, la extensión está instalada en:"
        echo "✅ saoudrizwan.claude-dev v3.17.12"
        ;;
    *)
        echo "❌ Opción no válida"
        ;;
esac

echo ""
echo "✅ Script completado" 