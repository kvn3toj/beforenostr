#!/bin/bash

# 🧹 SCRIPT DE LIMPIEZA DE PUERTOS OBSOLETOS
# Limpia las referencias restantes a puertos 3000, 3001, 3002

echo "🧹 INICIANDO LIMPIEZA DE REFERENCIAS A PUERTOS OBSOLETOS..."
echo "==========================================================="
echo ""

# Colors
GREEN='🟢'
RED='🔴'
YELLOW='🟡'
BLUE='🔵'

# Función para buscar y mostrar referencias
find_references() {
    local port=$1
    local description=$2
    
    echo "🔍 Buscando referencias a puerto $port ($description)..."
    
    # Buscar en archivos comunes excluyendo directorios problemáticos
    local files=$(grep -r "localhost:$port" . \
        --exclude-dir=node_modules \
        --exclude-dir=.git \
        --exclude-dir=dist \
        --exclude-dir=build \
        --exclude-dir=.next \
        --include="*.md" \
        --include="*.ts" \
        --include="*.js" \
        --include="*.json" \
        --include="*.sh" \
        --include="*.yml" \
        --include="*.yaml" \
        2>/dev/null)
    
    if [ -n "$files" ]; then
        echo "$YELLOW ENCONTRADAS:"
        echo "$files" | head -10  # Mostrar solo las primeras 10
        echo ""
        return 0
    else
        echo "$GREEN SIN REFERENCIAS"
        echo ""
        return 1
    fi
}

# Función para reemplazar referencias en un tipo de archivo
replace_in_files() {
    local old_port=$1
    local new_port=$2
    local file_pattern=$3
    local description=$4
    
    echo "📝 Reemplazando $old_port → $new_port en archivos $description..."
    
    local count=0
    
    # Buscar y reemplazar
    find . -type f -name "$file_pattern" \
        -not -path "./node_modules/*" \
        -not -path "./.git/*" \
        -not -path "./dist/*" \
        -not -path "./build/*" \
        -exec grep -l "localhost:$old_port" {} \; | while read -r file; do
        
        echo "  📄 Actualizando: $file"
        sed -i.bak "s/localhost:$old_port/localhost:$new_port/g" "$file"
        rm -f "$file.bak"
        ((count++))
    done
    
    return $count
}

# Función para limpiar documentación específica
clean_documentation() {
    echo "📚 Limpiando documentación específica..."
    
    # Archivos de documentación conocidos que pueden tener referencias
    local doc_files=(
        "docs/implementation/PORT_MIGRATION_SUMMARY.md"
        "docs/troubleshooting/BACKGROUND_AGENT_ERROR_RESOLUTION.md"
        "README.md"
        ".cursor/rules/totalrules.mdc"
    )
    
    for file in "${doc_files[@]}"; do
        if [ -f "$file" ]; then
            echo "  📄 Verificando: $file"
            
            # Solo mostrar pero no cambiar automáticamente archivos de documentación
            if grep -q "localhost:300[0-2]" "$file" 2>/dev/null; then
                echo "  $YELLOW Contiene referencias a puertos obsoletos (revisar manualmente)"
            else
                echo "  $GREEN Sin referencias problemáticas"
            fi
        fi
    done
}

echo "🎯 FASE 1: IDENTIFICACIÓN DE REFERENCIAS"
echo "========================================"

# Buscar referencias a cada puerto obsoleto
find_references "3000" "Gamifier Admin - OBSOLETO"
find_references "3001" "SuperApp - OBSOLETO"  
find_references "3002" "Backend - OBSOLETO"

echo ""
echo "🔧 FASE 2: LIMPIEZA AUTOMÁTICA"
echo "=============================="

# Limpiar referencias en archivos de configuración JavaScript/TypeScript
echo "🧹 Limpiando archivos de configuración..."
replace_in_files "3002" "1111" "*.ts" "TypeScript"
replace_in_files "3002" "1111" "*.js" "JavaScript"

# Limpiar referencias en archivos de script
echo "🧹 Limpiando scripts..."
replace_in_files "3000" "3333" "*.sh" "Shell scripts"
replace_in_files "3001" "2222" "*.sh" "Shell scripts"
replace_in_files "3002" "1111" "*.sh" "Shell scripts"

# Limpiar referencias en archivos JSON
echo "🧹 Limpiando configuraciones JSON..."
replace_in_files "3000" "3333" "*.json" "JSON"
replace_in_files "3001" "2222" "*.json" "JSON"
replace_in_files "3002" "1111" "*.json" "JSON"

echo ""
echo "📚 FASE 3: VERIFICACIÓN DE DOCUMENTACIÓN"
echo "========================================"

clean_documentation

echo ""
echo "🔍 FASE 4: VERIFICACIÓN POST-LIMPIEZA"
echo "====================================="

echo "🔍 Verificando limpieza..."

# Verificar que las referencias han sido eliminadas
for port in 3000 3001 3002; do
    local remaining=$(grep -r "localhost:$port" . \
        --exclude-dir=node_modules \
        --exclude-dir=.git \
        --exclude="*.md" \
        2>/dev/null | wc -l)
    
    if [ $remaining -eq 0 ]; then
        echo "$GREEN Puerto $port: Sin referencias restantes"
    else
        echo "$RED Puerto $port: $remaining referencias restantes"
    fi
done

echo ""
echo "📊 RESUMEN DE LIMPIEZA"
echo "====================="

# Verificar configuraciones actuales
echo "📋 Configuraciones actualizadas:"
echo "  🔧 Backend: $(grep -o 'localhost:[0-9]*' .env 2>/dev/null | head -1 || echo 'No encontrado')"
echo "  🎮 SuperApp: $(grep -o 'localhost:[0-9]*' Demo/apps/superapp-unified/.env 2>/dev/null | head -1 || echo 'No encontrado')"
echo "  🔧 Admin: $(grep -o 'localhost:[0-9]*' apps/admin-frontend/.env 2>/dev/null | head -1 || echo 'No encontrado')"

echo ""
echo "🎉 LIMPIEZA COMPLETADA"
echo "====================="
echo "✅ Se han procesado las referencias a puertos obsoletos"
echo "⚠️  Revisa manualmente la documentación si es necesario"
echo "🔍 Ejecuta 'npm run rules:verify' para confirmar limpieza"

echo ""
echo "📋 COMANDOS SUGERIDOS:"
echo "====================="
echo "🔍 Verificar reglas: npm run rules:verify"
echo "🚀 Iniciar desarrollo: npm run dev"
echo "📊 Ver resumen: npm run port:summary"