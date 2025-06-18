#!/bin/bash

# 🗑️ SCRIPT DE ELIMINACIÓN SEGURA DE MOCKS - FASE 1: MARKETPLACE
# Elimina marketplaceMockData.ts y refactoriza referencias para desbloquear efectos visuales

echo "🗑️ ELIMINACIÓN SEGURA DE MOCKS - FASE 1: MARKETPLACE"
echo "====================================================="
echo ""

# VERIFICACIONES PREVIAS
echo "🔍 VERIFICACIONES PREVIAS:"

# 1. Verificar que estamos en la raíz del monorepo
if [ ! -f "package.json" ] || [ ! -d "Demo/apps/superapp-unified" ]; then
    echo "❌ ERROR: Ejecutar desde la raíz del monorepo"
    exit 1
fi
echo "├── ✅ Ubicación correcta verificada"

# 2. Verificar que el archivo existe
if [ ! -f "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts" ]; then
    echo "├── ❌ marketplaceMockData.ts ya fue eliminado"
    echo "└── ℹ️ Continuando con verificación de referencias..."
else
    echo "├── ✅ marketplaceMockData.ts detectado ($(wc -l < Demo/apps/superapp-unified/src/data/marketplaceMockData.ts) líneas)"
fi

# 3. Verificar backend disponible
echo "├── 🏥 Verificando backend NestJS..."
if curl -s http://localhost:3002/health >/dev/null 2>&1; then
    echo "├── ✅ Backend NestJS disponible (puerto 3002)"
else
    echo "├── ⚠️ Backend NestJS no disponible - proceder con precaución"
fi

# 4. Verificar endpoints marketplace
echo "├── 📊 Verificando endpoints marketplace..."
MARKETPLACE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/marketplace/items 2>/dev/null || echo "000")
if [ "$MARKETPLACE_STATUS" = "200" ]; then
    echo "└── ✅ Endpoint /marketplace/items disponible (HTTP $MARKETPLACE_STATUS)"
elif [ "$MARKETPLACE_STATUS" = "404" ]; then
    echo "└── ⚠️ Endpoint /marketplace/items no implementado (HTTP 404)"
else
    echo "└── ❌ Endpoint /marketplace/items no disponible (HTTP $MARKETPLACE_STATUS)"
fi
echo ""

# PASO 1: Crear backup de seguridad
echo "💾 PASO 1: BACKUP DE SEGURIDAD"
mkdir -p _temp_mock_backup/phase1-marketplace/
echo "├── Directorio backup creado: _temp_mock_backup/phase1-marketplace/"

if [ -f "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts" ]; then
    cp Demo/apps/superapp-unified/src/data/marketplaceMockData.ts _temp_mock_backup/phase1-marketplace/
    echo "├── ✅ marketplaceMockData.ts respaldado"
else
    echo "├── ℹ️ marketplaceMockData.ts ya no existe"
fi

# Backup de archivos que referencian el mock
echo "├── Buscando archivos que referencian marketplaceMockData..."
REFERENCING_FILES=$(grep -r "marketplaceMockData" Demo/apps/superapp-unified/src/ 2>/dev/null | cut -d: -f1 | sort | uniq)
if [ ! -z "$REFERENCING_FILES" ]; then
    echo "$REFERENCING_FILES" | while read file; do
        if [ -f "$file" ]; then
            rel_path=${file#Demo/apps/superapp-unified/src/}
            backup_dir="_temp_mock_backup/phase1-marketplace/$(dirname "$rel_path")"
            mkdir -p "$backup_dir"
            cp "$file" "$backup_dir/"
            echo "│   ├── Respaldado: $(basename "$file")"
        fi
    done
else
    echo "│   └── ℹ️ No se encontraron referencias a marketplaceMockData"
fi
echo "└── ✅ Backup completado"
echo ""

# PASO 2: Eliminar marketplaceMockData.ts
echo "🔥 PASO 2: ELIMINAR ARCHIVO CRÍTICO"
if [ -f "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts" ]; then
    LINES_BEFORE=$(wc -l < Demo/apps/superapp-unified/src/data/marketplaceMockData.ts)
    rm Demo/apps/superapp-unified/src/data/marketplaceMockData.ts
    echo "├── 🗑️ marketplaceMockData.ts eliminado ($LINES_BEFORE líneas)"
    
    # Verificar que el directorio data/ no quede vacío
    if [ -d "Demo/apps/superapp-unified/src/data" ] && [ -z "$(ls -A Demo/apps/superapp-unified/src/data 2>/dev/null)" ]; then
        rmdir Demo/apps/superapp-unified/src/data
        echo "├── 🗑️ Directorio data/ vacío eliminado"
    fi
else
    echo "├── ℹ️ marketplaceMockData.ts ya estaba eliminado"
fi
echo "└── ✅ Eliminación completada"
echo ""

# PASO 3: Detectar y reportar importaciones rotas
echo "🔧 PASO 3: DETECTAR IMPORTACIONES ROTAS"
echo "├── Buscando importaciones rotas..."

BROKEN_IMPORTS=$(grep -r "from.*marketplaceMockData\|import.*marketplaceMockData" Demo/apps/superapp-unified/src/ 2>/dev/null | cut -d: -f1 | sort | uniq)
if [ ! -z "$BROKEN_IMPORTS" ]; then
    echo "├── 🚨 IMPORTACIONES ROTAS DETECTADAS:"
    echo "$BROKEN_IMPORTS" | while read file; do
        echo "│   ├── ❌ $file"
        # Mostrar las líneas específicas con problemas
        grep -n "marketplaceMockData" "$file" 2>/dev/null | head -3 | while read line; do
            echo "│   │   └── Línea: $line"
        done
    done
    echo "│   └── ⚠️ ACCIÓN REQUERIDA: Refactorizar estos archivos"
else
    echo "├── ✅ No se detectaron importaciones rotas"
fi

# Buscar referencias restantes
REMAINING_REFS=$(grep -r "marketplaceMockData" Demo/apps/superapp-unified/src/ 2>/dev/null | wc -l)
if [ "$REMAINING_REFS" -gt 0 ]; then
    echo "├── ⚠️ Referencias restantes detectadas: $REMAINING_REFS"
    echo "│   └── Ver archivos en backup para refactorización manual"
else
    echo "├── ✅ No quedan referencias a marketplaceMockData"
fi
echo "└── ✅ Detección completada"
echo ""

# PASO 4: Verificar compilación
echo "🛠️ PASO 4: VERIFICAR COMPILACIÓN"
echo "├── Intentando compilar SuperApp..."
cd Demo/apps/superapp-unified/
if npm run build --silent >/dev/null 2>&1; then
    echo "├── ✅ Compilación exitosa"
else
    echo "├── ❌ Errores de compilación detectados"
    echo "│   └── Ejecutar: cd Demo/apps/superapp-unified && npm run build"
fi
cd ../../../
echo "└── ✅ Verificación completada"
echo ""

# PASO 5: Resumen y próximos pasos
echo "📋 RESUMEN FASE 1 - MARKETPLACE:"
echo "├── 🗑️ marketplaceMockData.ts: $([ -f "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts" ] && echo "❌ AÚN EXISTE" || echo "✅ ELIMINADO")"
echo "├── 💾 Backup creado: _temp_mock_backup/phase1-marketplace/"
echo "├── 🔧 Importaciones rotas: $(echo "$BROKEN_IMPORTS" | wc -l) archivos"
echo "├── 📝 Referencias restantes: $REMAINING_REFS referencias"
echo "└── 🎯 Estado: $([ "$REMAINING_REFS" -eq 0 ] && echo "✅ FASE 1 COMPLETADA" || echo "⚠️ REFACTORIZACIÓN MANUAL REQUERIDA")"
echo ""

if [ ! -z "$BROKEN_IMPORTS" ]; then
    echo "🔧 PRÓXIMOS PASOS MANUALES:"
    echo "1. Refactorizar archivos con importaciones rotas:"
    echo "$BROKEN_IMPORTS" | while read file; do
        echo "   - $file"
    done
    echo "2. Cambiar importaciones a usar marketplaceAPI del backend"
    echo "3. Ejecutar: npm run dev para verificar funcionamiento"
    echo "4. Verificar efectos visuales desbloqueados en /marketplace"
else
    echo "🎉 FASE 1 COMPLETADA CON ÉXITO!"
    echo "├── ✅ marketplace mock eliminado sin errores"
    echo "├── 🔧 Ejecutar: npm run dev para verificar"
    echo "└── 🎨 Verificar efectos visuales en /marketplace"
fi

echo ""
echo "🎯 SIGUIENTE FASE: ./Demo/scripts/eliminate-mocks-phase2.sh (ÜPlay)"
echo "====================================================="