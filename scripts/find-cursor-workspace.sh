#!/bin/bash

echo "🔍 Buscando workspace específico de Cursor para proyecto GAMIFIER/CoomÜnity..."
echo ""

WORKSPACE_DIR="/Users/kevinp/Library/Application Support/Cursor/User/workspaceStorage"
FOUND_WORKSPACES=()
TOTAL_CHECKED=0

for dir in "$WORKSPACE_DIR"/*/; do
    if [ -f "${dir}state.vscdb" ]; then
        TOTAL_CHECKED=$((TOTAL_CHECKED + 1))
        workspace_id=$(basename "$dir")
        echo -ne "\r🔍 Revisando workspace $TOTAL_CHECKED/90: $workspace_id"
        
        # Buscar en la base de datos del workspace
        MATCHES=$(sqlite3 "${dir}state.vscdb" "SELECT COUNT(*) FROM ItemTable WHERE key LIKE '%gamifier%' OR key LIKE '%coomunity%' OR key LIKE '%GAMIFIER%' OR key LIKE '%Demo%' OR key LIKE '%superapp%' OR key LIKE '%CoomÜnity%';" 2>/dev/null)
        
        if [ "$MATCHES" -gt 0 ]; then
            echo ""
            echo "✅ ENCONTRADO: $workspace_id ($MATCHES coincidencias)"
            FOUND_WORKSPACES+=("$workspace_id")
            
            # Mostrar algunas claves encontradas
            echo "📋 Claves encontradas:"
            sqlite3 "${dir}state.vscdb" "SELECT key FROM ItemTable WHERE key LIKE '%gamifier%' OR key LIKE '%coomunity%' OR key LIKE '%GAMIFIER%' OR key LIKE '%Demo%' OR key LIKE '%superapp%' OR key LIKE '%CoomÜnity%' LIMIT 10;" 2>/dev/null | sed 's/^/   - /'
            echo ""
        fi
    fi
done

echo ""
echo "🏁 Búsqueda completada. Workspaces encontrados: ${#FOUND_WORKSPACES[@]}"

if [ ${#FOUND_WORKSPACES[@]} -gt 0 ]; then
    echo ""
    echo "📁 Workspaces relevantes:"
    for ws in "${FOUND_WORKSPACES[@]}"; do
        echo "   - $ws"
        echo "     Ruta: $WORKSPACE_DIR/$ws/state.vscdb"
    done
    
    echo ""
    echo "🔧 Para extraer chats del workspace más relevante, ejecuta:"
    echo "   sqlite3 \"$WORKSPACE_DIR/${FOUND_WORKSPACES[0]}/state.vscdb\" \"SELECT key FROM ItemTable WHERE key LIKE '%chat%' OR key LIKE '%message%' OR key LIKE '%conversation%';\""
fi 