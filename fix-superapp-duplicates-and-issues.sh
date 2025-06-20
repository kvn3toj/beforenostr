#!/bin/bash

echo "🔍 ESCANEO Y CORRECCIÓN: Duplicados y Problemas que Bloquean Cambios Visuales"
echo "=============================================================================="
echo "📅 Fecha: $(date)"
echo "📍 Directorio: $(pwd)"
echo ""

# CONTADORES
declare -i issues_found=0
declare -i issues_fixed=0
declare -i grid_warnings=0
declare -i reward_issues=0
declare -i duplicate_files=0

echo "🔎 FASE 1: DETECCIÓN DE PROBLEMAS CRÍTICOS"
echo "============================================"

# 1. DETECCIÓN: Material UI Grid v7 Warnings
echo "1️⃣ Escaneando warnings Material UI Grid v7..."
grid_count=$(find Demo/apps/superapp-unified/src -name "*.tsx" -exec grep -l "Grid item" {} \; | wc -l)
if [ $grid_count -gt 0 ]; then
    echo "   ⚠️ ENCONTRADOS: $grid_count archivos con sintaxis Grid obsoleta"
    ((issues_found++))
    ((grid_warnings=grid_count))
    echo "   📋 Archivos afectados:"
    find Demo/apps/superapp-unified/src -name "*.tsx" -exec grep -l "Grid item" {} \; | head -10
else
    echo "   ✅ No se encontraron warnings de Grid"
fi

# 2. DETECCIÓN: Accesos inseguros a .rewards
echo "2️⃣ Escaneando accesos inseguros a .rewards..."
unsafe_rewards=$(find Demo/apps/superapp-unified/src -name "*.tsx" -exec grep -n "\.rewards\." {} \; | grep -v "\.rewards\?" | wc -l)
if [ $unsafe_rewards -gt 0 ]; then
    echo "   ⚠️ ENCONTRADOS: $unsafe_rewards accesos potencialmente inseguros a .rewards"
    ((issues_found++))
    ((reward_issues=unsafe_rewards))
    echo "   📋 Ejemplos encontrados:"
    find Demo/apps/superapp-unified/src -name "*.tsx" -exec grep -n "\.rewards\." {} \; | grep -v "\.rewards\?" | head -5
else
    echo "   ✅ Todos los accesos a .rewards son seguros"
fi

# 3. DETECCIÓN: Archivos duplicados o problemáticos
echo "3️⃣ Escaneando archivos duplicados y obsoletos..."

# Buscar archivos .bak, .backup, .old
duplicate_files_found=$(find Demo/apps/superapp-unified/src -name "*.bak*" -o -name "*.backup*" -o -name "*.old*" | wc -l)
if [ $duplicate_files_found -gt 0 ]; then
    echo "   ⚠️ ENCONTRADOS: $duplicate_files_found archivos de backup que pueden causar conflictos"
    ((issues_found++))
    ((duplicate_files=duplicate_files_found))
    echo "   📋 Archivos encontrados:"
    find Demo/apps/superapp-unified/src -name "*.bak*" -o -name "*.backup*" -o -name "*.old*"
else
    echo "   ✅ No se encontraron archivos de backup problemáticos"
fi

# Buscar páginas duplicadas en diferentes directorios
echo "4️⃣ Verificando páginas duplicadas..."
duplicate_pages=0

# Verificar si hay UPlayGamifiedDashboard duplicado
uplay_dashboards=$(find Demo/apps/superapp-unified/src -name "*UPlayGamifiedDashboard*" | wc -l)
if [ $uplay_dashboards -gt 1 ]; then
    echo "   ⚠️ ENCONTRADOS: $uplay_dashboards archivos UPlayGamifiedDashboard (esperado: 1)"
    ((duplicate_pages++))
    find Demo/apps/superapp-unified/src -name "*UPlayGamifiedDashboard*"
fi

# Verificar HomePage duplicada
home_pages=$(find Demo/apps/superapp-unified/src -name "*HomePage*" -o -name "*Home.tsx*" | wc -l)
if [ $home_pages -gt 2 ]; then  # Esperamos Home.tsx y HomePage.tsx
    echo "   ⚠️ ENCONTRADOS: $home_pages archivos Home (esperado: máximo 2)"
    ((duplicate_pages++))
    find Demo/apps/superapp-unified/src -name "*HomePage*" -o -name "*Home.tsx*"
fi

if [ $duplicate_pages -gt 0 ]; then
    ((issues_found++))
else
    echo "   ✅ No se encontraron páginas duplicadas problemáticas"
fi

# 5. DETECCIÓN: CSS de override problemático
echo "5️⃣ Escaneando CSS de override que puede bloquear cambios..."
problematic_css=$(find Demo/apps/superapp-unified/src -name "*.css" -exec grep -l "background-color.*rgb(41, 37, 36)" {} \; | wc -l)
if [ $problematic_css -gt 0 ]; then
    echo "   ⚠️ ENCONTRADOS: $problematic_css archivos CSS con overrides de color oscuro"
    ((issues_found++))
    echo "   📋 Archivos CSS problemáticos:"
    find Demo/apps/superapp-unified/src -name "*.css" -exec grep -l "background-color.*rgb(41, 37, 36)" {} \;
else
    echo "   ✅ No se encontraron CSS problemáticos"
fi

echo ""
echo "📊 RESUMEN DE DETECCIÓN:"
echo "   🔍 Issues totales encontrados: $issues_found"
echo "   ⚠️ Warnings Grid MUI: $grid_warnings archivos"
echo "   🎯 Accesos rewards inseguros: $reward_issues"
echo "   📁 Archivos duplicados: $duplicate_files"
echo "   📄 Páginas duplicadas: $duplicate_pages"
echo ""

if [ $issues_found -eq 0 ]; then
    echo "🎉 ¡EXCELENTE! No se encontraron problemas críticos."
    echo "   Los cambios visuales deberían ser completamente visibles."
    exit 0
fi

echo "🔧 FASE 2: CORRECCIÓN AUTOMÁTICA DE PROBLEMAS"
echo "============================================="

# CORRECCIÓN 1: Material UI Grid v7
if [ $grid_warnings -gt 0 ]; then
    echo "🔧 Corrigiendo warnings Material UI Grid v7..."
    
    # Crear backup de seguridad
    mkdir -p backups/grid-fixes-$(date +%Y%m%d_%H%M%S)
    
    # Lista de archivos a corregir
    grid_files=$(find Demo/apps/superapp-unified/src -name "*.tsx" -exec grep -l "Grid item" {} \;)
    
    for file in $grid_files; do
        if [ -f "$file" ]; then
            echo "   📝 Corrigiendo: $file"
            
            # Backup individual
            cp "$file" "backups/grid-fixes-$(date +%Y%m%d_%H%M%S)/$(basename $file).bak"
            
            # Aplicar correcciones con sed
            sed -i.tmp 's/<Grid item xs=\([0-9]*\) sm=\([0-9]*\) md=\([0-9]*\) lg=\([0-9]*\)>/<Grid size={{ xs: \1, sm: \2, md: \3, lg: \4 }}>/g' "$file"
            sed -i.tmp 's/<Grid item xs=\([0-9]*\) sm=\([0-9]*\) md=\([0-9]*\)>/<Grid size={{ xs: \1, sm: \2, md: \3 }}>/g' "$file"
            sed -i.tmp 's/<Grid item xs=\([0-9]*\) md=\([0-9]*\)>/<Grid size={{ xs: \1, md: \2 }}>/g' "$file"
            sed -i.tmp 's/<Grid item xs=\([0-9]*\)>/<Grid size={{ xs: \1 }}>/g' "$file"
            sed -i.tmp 's/<Grid item>/<Grid>/g' "$file"
            
            # Limpiar archivos temporales
            rm -f "$file.tmp"
            
            ((issues_fixed++))
        fi
    done
    
    echo "   ✅ Grid warnings corregidos en $grid_warnings archivos"
fi

# CORRECCIÓN 2: Accesos inseguros a .rewards
if [ $reward_issues -gt 0 ]; then
    echo "🔧 Corrigiendo accesos inseguros a .rewards..."
    
    # Buscar y corregir patrones específicos
    find Demo/apps/superapp-unified/src -name "*.tsx" -exec grep -l "\.rewards\." {} \; | while read file; do
        if grep -q "\.rewards\." "$file" && ! grep -q "\.rewards\?" "$file"; then
            echo "   📝 Revisando: $file"
            
            # Crear backup
            cp "$file" "$file.$(date +%Y%m%d_%H%M%S).bak"
            
            # Aplicar corrección de optional chaining
            sed -i.tmp 's/\([a-zA-Z0-9_]*\)\.rewards\.meritos/\1.rewards?.meritos || 0/g' "$file"
            sed -i.tmp 's/\([a-zA-Z0-9_]*\)\.rewards\.ondas/\1.rewards?.ondas || 0/g' "$file"
            sed -i.tmp 's/\([a-zA-Z0-9_]*\)\.rewards\.xp/\1.rewards?.xp || 0/g' "$file"
            sed -i.tmp 's/\([a-zA-Z0-9_]*\)\.rewards\.currency/\1.rewards?.currency || 0/g' "$file"
            
            rm -f "$file.tmp"
            echo "   ✅ Corregido: $file"
            ((issues_fixed++))
        fi
    done
fi

# CORRECCIÓN 3: Eliminar archivos duplicados
if [ $duplicate_files -gt 0 ]; then
    echo "🔧 Eliminando archivos duplicados problemáticos..."
    
    # Mover archivos duplicados a carpeta temporal
    mkdir -p backups/removed-duplicates-$(date +%Y%m%d_%H%M%S)
    
    find Demo/apps/superapp-unified/src -name "*.bak*" -o -name "*.backup*" -o -name "*.old*" | while read file; do
        echo "   🗑️ Moviendo: $file"
        mv "$file" "backups/removed-duplicates-$(date +%Y%m%d_%H%M%S)/"
        ((issues_fixed++))
    done
    
    echo "   ✅ Archivos duplicados movidos a backup"
fi

# CORRECCIÓN 4: Optimizar CSS problemático
if [ $problematic_css -gt 0 ]; then
    echo "🔧 Optimizando CSS que bloquea cambios visuales..."
    
    # Comentar overrides problemáticos en lugar de eliminarlos
    find Demo/apps/superapp-unified/src -name "*.css" -exec grep -l "background-color.*rgb(41, 37, 36)" {} \; | while read file; do
        echo "   📝 Comentando overrides problemáticos en: $file"
        
        # Backup
        cp "$file" "$file.$(date +%Y%m%d_%H%M%S).bak"
        
        # Comentar líneas problemáticas
        sed -i.tmp 's/\(.*background-color.*rgb(41, 37, 36).*\)/\/\* COMMENTED FOR VISUAL FIXES: \1 \*\//' "$file"
        sed -i.tmp 's/\(.*backgroundColor.*rgb(41, 37, 36).*\)/\/\* COMMENTED FOR VISUAL FIXES: \1 \*\//' "$file"
        
        rm -f "$file.tmp"
        ((issues_fixed++))
    done
    
    echo "   ✅ CSS problemático comentado temporalmente"
fi

echo ""
echo "🧹 FASE 3: LIMPIEZA Y OPTIMIZACIÓN"
echo "=================================="

# Limpiar node_modules/.vite cache que puede estar causando problemas
echo "🧹 Limpiando caché de Vite..."
if [ -d "Demo/apps/superapp-unified/node_modules/.vite" ]; then
    rm -rf Demo/apps/superapp-unified/node_modules/.vite
    echo "   ✅ Caché de Vite limpiado"
    ((issues_fixed++))
else
    echo "   ℹ️ No se encontró caché de Vite para limpiar"
fi

# Verificar que no hay procesos múltiples ejecutándose
echo "🧹 Verificando procesos múltiples..."
multiple_vite=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l)
if [ $multiple_vite -gt 1 ]; then
    echo "   ⚠️ ENCONTRADOS: $multiple_vite procesos Vite/npm ejecutándose"
    echo "   💡 RECOMENDACIÓN: Ejecutar 'pkill -f vite' antes de reiniciar"
    ((issues_found++))
else
    echo "   ✅ Solo un proceso de desarrollo ejecutándose"
fi

echo ""
echo "🎯 FASE 4: VERIFICACIÓN POST-CORRECCIÓN"
echo "======================================="

# Re-verificar Grid warnings
echo "🔍 Re-verificando Grid warnings..."
remaining_grid=$(find Demo/apps/superapp-unified/src -name "*.tsx" -exec grep -l "Grid item" {} \; | wc -l)
if [ $remaining_grid -eq 0 ]; then
    echo "   ✅ Todos los Grid warnings corregidos"
else
    echo "   ⚠️ Aún quedan $remaining_grid archivos con Grid warnings"
fi

# Re-verificar accesos rewards
echo "🔍 Re-verificando accesos a .rewards..."
remaining_rewards=$(find Demo/apps/superapp-unified/src -name "*.tsx" -exec grep -n "\.rewards\." {} \; | grep -v "\.rewards\?" | wc -l)
if [ $remaining_rewards -eq 0 ]; then
    echo "   ✅ Todos los accesos a .rewards son seguros"
else
    echo "   ⚠️ Aún quedan $remaining_rewards accesos potencialmente inseguros"
fi

# Verificar servicios
echo "🔍 Verificando servicios activos..."
backend_ok=$(curl -s http://localhost:3002/health >/dev/null && echo "✅" || echo "❌")
superapp_ok=$(curl -s -I http://localhost:3001 | grep -q "200 OK" && echo "✅" || echo "❌")

echo "   $backend_ok Backend (puerto 3002)"
echo "   $superapp_ok SuperApp (puerto 3001)"

echo ""
echo "📊 RESUMEN FINAL DE CORRECCIONES:"
echo "   🔧 Issues corregidos: $issues_fixed"
echo "   ⚠️ Issues restantes: $((issues_found - issues_fixed))"

correction_percentage=$((issues_fixed * 100 / (issues_found == 0 ? 1 : issues_found)))
echo "   📈 Porcentaje de corrección: $correction_percentage%"

echo ""
echo "🎯 RECOMENDACIONES PARA VERIFICAR CAMBIOS:"
echo "   1. 🔄 Reiniciar servidor de desarrollo: 'pkill -f vite && npm run dev:superapp'"
echo "   2. 🧹 Limpiar caché del navegador (Ctrl+Shift+R)"
echo "   3. 🌐 Verificar ÜPlay: http://localhost:3001/uplay"
echo "   4. 🏠 Verificar Home: http://localhost:3001/"
echo "   5. 🛍️ Verificar Marketplace: http://localhost:3001/marketplace"

if [ $correction_percentage -ge 80 ]; then
    echo ""
    echo "🎉 ¡CORRECCIONES MAYORITARIAMENTE EXITOSAS!"
    echo "   Los cambios visuales implementados ahora deberían ser completamente visibles."
    echo "   Se recomienda reiniciar el servidor para aplicar todos los cambios."
    exit 0
elif [ $correction_percentage -ge 50 ]; then
    echo ""
    echo "✅ CORRECCIONES PARCIALMENTE EXITOSAS"
    echo "   La mayoría de problemas fueron corregidos."
    echo "   Se recomienda revisar manualmente los issues restantes."
    exit 0
else
    echo ""
    echo "⚠️ CORRECCIONES LIMITADAS"
    echo "   Se recomiedan correcciones manuales adicionales."
    echo "   Revisar backups creados para referencias."
    exit 1
fi 