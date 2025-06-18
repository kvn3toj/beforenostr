#!/bin/bash

# 🚀 Script de Migración de Puertos CoomÜnity
# Cambia todos los puertos de 3000/3001/3002 a 3333/2222/1111

echo "🔄 Iniciando migración de puertos..."
echo "📋 Cambios:"
echo "   Backend: 3002 → 1111"
echo "   SuperApp: 3001 → 2222" 
echo "   Admin: 3000 → 3333"
echo ""

# Backup first
echo "📦 Creando respaldo..."
mkdir -p backups/port-migration-$(date +%Y%m%d-%H%M%S)

# Function to update files
update_files() {
    local old_port=$1
    local new_port=$2
    local description=$3
    
    echo "🔄 Actualizando $description ($old_port → $new_port)..."
    
    # Find and replace in scripts, configs, and docs
    find . -type f \( -name "*.sh" -o -name "*.js" -o -name "*.ts" -o -name "*.md" -o -name "*.json" \) \
        -not -path "./node_modules/*" \
        -not -path "./.git/*" \
        -not -path "./backups/*" \
        -exec sed -i.bak "s|localhost:$old_port|localhost:$new_port|g" {} \;
    
    # Clean backup files
    find . -name "*.bak" -not -path "./node_modules/*" -not -path "./.git/*" -delete
}

# Update Backend references (3002 → 1111)
update_files "3002" "1111" "Backend"

# Update SuperApp references (3001 → 2222)  
update_files "3001" "2222" "SuperApp"

# Update Admin references (3000 → 3333)
update_files "3000" "3333" "Admin"

echo ""
echo "✅ Migración de puertos completada!"
echo "📋 Nuevos puertos:"
echo "   🔧 Admin Frontend: http://localhost:3333"
echo "   🎮 SuperApp: http://localhost:2222"
echo "   ⚙️  Backend: http://localhost:1111"
echo ""
echo "🔥 Para iniciar el ecosistema:"
echo "   npm run dev"