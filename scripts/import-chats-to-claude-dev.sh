#!/bin/bash

# 🔄 SCRIPT DE IMPORTACIÓN DE CHATS NATIVOS A CLAUDE DEV
# Convierte chats extraídos de Cursor al formato de Claude Dev
# Para el proyecto CoomÜnity - GAMIFIER-copy

echo "🔄 IMPORTADOR DE CHATS A CLAUDE DEV - PROYECTO COOMUNITY"
echo "========================================================"
echo ""

INPUT_DIR="logs/cursor-chats"
CLAUDE_DEV_DIR="/Users/kevinp/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/tasks"
TIMESTAMP=$(date +%s%3N)

if [ ! -d "$INPUT_DIR" ]; then
    echo "❌ Error: No se encontró el directorio de chats extraídos"
    echo "📍 Esperado en: $INPUT_DIR"
    echo "💡 Ejecute primero: ./scripts/extract-cursor-chats.sh"
    exit 1
fi

echo "📋 CONFIGURACIÓN DE IMPORTACIÓN:"
echo "📁 Directorio origen: $INPUT_DIR"
echo "📁 Directorio destino: $CLAUDE_DEV_DIR"
echo "🕒 Timestamp para nueva tarea: $TIMESTAMP"
echo ""

# Crear directorio para la nueva tarea importada
NEW_TASK_DIR="$CLAUDE_DEV_DIR/$TIMESTAMP"
mkdir -p "$NEW_TASK_DIR"

echo "🔧 CREANDO ESTRUCTURA DE CLAUDE DEV..."

# Crear metadata para la tarea importada
cat > "$NEW_TASK_DIR/task_metadata.json" << EOF
{
  "version": "3.17.12",
  "task": "Importación de chats nativos de Cursor - Proyecto CoomÜnity",
  "date": "$(date -Iseconds)",
  "imported_from": "cursor_native_chats",
  "total_chats": $(ls -1 "$INPUT_DIR"/*.txt 2>/dev/null | wc -l | tr -d ' '),
  "project": "CoomÜnity SuperApp",
  "workspace": "/Users/kevinp/Movies/GAMIFIER-copy"
}
EOF

# Crear historial de conversación combinando todos los chats
echo "📚 COMBINANDO CHATS EN FORMATO CLAUDE DEV..."

cat > "$NEW_TASK_DIR/api_conversation_history.json" << 'EOF'
[
  {
    "role": "system",
    "content": "📋 HISTORIAL IMPORTADO DE CHATS NATIVOS DE CURSOR\nProyecto: CoomÜnity SuperApp\nWorkspace: /Users/kevinp/Movies/GAMIFIER-copy\n\nContexto del proyecto:\n- Backend NestJS en puerto 3002\n- SuperApp en puerto 3001 \n- Credenciales: admin@gamifier.com / admin123\n- Arquitectura: React + TypeScript + Material UI + NestJS + PostgreSQL + Prisma\n\n--- INICIO DE CHATS IMPORTADOS ---"
  },
EOF

# Agregar cada chat como un mensaje en el historial
echo "🔄 PROCESANDO CHATS INDIVIDUALES..."
CHAT_COUNT=0

for chat_file in "$INPUT_DIR"/*.txt; do
    if [ -f "$chat_file" ]; then
        CHAT_COUNT=$((CHAT_COUNT + 1))
        filename=$(basename "$chat_file")
        
        echo "   📄 Procesando: $filename"
        
        # Agregar el chat como mensaje del usuario
        cat >> "$NEW_TASK_DIR/api_conversation_history.json" << EOF
  {
    "role": "user",
    "content": "📄 CHAT IMPORTADO: $filename\n\n$(cat "$chat_file" | sed 's/"/\\"/g' | sed 's/$/\\n/' | tr -d '\n')"
  },
EOF
    fi
done

# Cerrar el JSON array
sed -i '' '$ s/,$//' "$NEW_TASK_DIR/api_conversation_history.json"
echo "]" >> "$NEW_TASK_DIR/api_conversation_history.json"

# Crear UI messages
cat > "$NEW_TASK_DIR/ui_messages.json" << EOF
[
  {
    "type": "ask",
    "text": "🔄 Chats nativos de Cursor importados exitosamente",
    "timestamp": "$(date -Iseconds)"
  },
  {
    "type": "say", 
    "text": "✅ Se importaron $CHAT_COUNT chats del proyecto CoomÜnity:\n\n📋 **Contenido recuperado:**\n- Configuración del entorno de desarrollo\n- Tareas de backend NestJS (puerto 3002)\n- Configuración SuperApp (puerto 3001)\n- Credenciales de autenticación\n- Archivos clave del proyecto\n\n📁 **Ubicación original:** logs/cursor-chats/\n📁 **Importado a:** Claude Dev task $TIMESTAMP\n\n💡 **Para continuar:** Use esta información como contexto para nuevas tareas.",
    "timestamp": "$(date -Iseconds)"
  }
]
EOF

echo ""
echo "✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE!"
echo ""
echo "📋 RESUMEN:"
echo "✅ Chats procesados: $CHAT_COUNT"
echo "📁 Nueva tarea creada: $TIMESTAMP"
echo "📍 Ubicación: $NEW_TASK_DIR"
echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo "1. Abra Claude Dev en Cursor (Cmd+Shift+P → 'Claude Dev')"
echo "2. La nueva tarea aparecerá en el historial"
echo "3. Puede continuar desde donde se quedó"
echo ""
echo "💡 Para acceso directo:"
echo "   open '$NEW_TASK_DIR'" 