#!/bin/bash

# 🚀 CoomÜnity Cursor Performance Optimizer
# Diagnóstica y optimiza el rendimiento de Cursor en el proyecto CoomÜnity

echo "🚀 CoomÜnity Cursor Performance Optimizer"
echo "========================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar ubicación
CURRENT_DIR=$(pwd)
EXPECTED_DIR="/Users/kevinp/Movies/GAMIFIER-copy"

if [ "$CURRENT_DIR" != "$EXPECTED_DIR" ]; then
    echo -e "${RED}❌ ERROR: Ubicación incorrecta${NC}"
    echo "📍 Actual: $CURRENT_DIR"
    echo "📍 Esperada: $EXPECTED_DIR"
    echo "🔧 Ejecuta: cd '$EXPECTED_DIR'"
    exit 1
fi

echo -e "${GREEN}✅ Ubicación correcta verificada${NC}"
echo ""

# 1. ANÁLISIS DE DIRECTORIOS PESADOS
echo "📊 ANÁLISIS DE DIRECTORIOS PESADOS"
echo "================================="
echo ""

echo "📁 Directorios node_modules encontrados:"
NODE_MODULES_COUNT=$(find . -name "node_modules" -type d 2>/dev/null | wc -l)
echo "   Total: $NODE_MODULES_COUNT directorios"

echo ""
echo "💾 Tamaños de directorios pesados:"
echo "   Demo/data/backups/: $(du -sh Demo/data/backups/ 2>/dev/null | cut -f1 || echo 'No encontrado')"
echo "   _temp_frontend_src_files/: $(du -sh _temp_frontend_src_files/ 2>/dev/null | cut -f1 || echo 'No encontrado')"
echo "   src_mixed_backup/: $(du -sh src_mixed_backup/ 2>/dev/null | cut -f1 || echo 'No encontrado')"
echo "   Demo/apps/superapp-unified/node_modules/: $(du -sh Demo/apps/superapp-unified/node_modules/ 2>/dev/null | cut -f1 || echo 'No encontrado')"
echo "   Demo/node_modules/: $(du -sh Demo/node_modules/ 2>/dev/null | cut -f1 || echo 'No encontrado')"

# Calcular tamaño total de archivos excluidos
TOTAL_SIZE=0
for dir in "Demo/data/backups" "_temp_frontend_src_files" "src_mixed_backup" "Demo/apps/superapp-unified/node_modules" "Demo/node_modules"; do
    if [ -d "$dir" ]; then
        SIZE=$(du -sm "$dir" 2>/dev/null | cut -f1)
        TOTAL_SIZE=$((TOTAL_SIZE + SIZE))
    fi
done

echo ""
if [ $TOTAL_SIZE -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Total de archivos excluidos del file watcher: ${TOTAL_SIZE}MB${NC}"
    if [ $TOTAL_SIZE -gt 500 ]; then
        echo -e "${RED}🐌 ALTO IMPACTO: Más de 500MB excluidos mejorará significativamente el rendimiento${NC}"
    elif [ $TOTAL_SIZE -gt 200 ]; then
        echo -e "${YELLOW}📈 IMPACTO MEDIO: Más de 200MB excluidos mejorará el rendimiento${NC}"
    else
        echo -e "${GREEN}📊 IMPACTO BAJO: Menos de 200MB excluidos${NC}"
    fi
fi

echo ""

# 2. VERIFICACIÓN DE CONFIGURACIÓN
echo "⚙️  VERIFICACIÓN DE CONFIGURACIÓN"
echo "================================="
echo ""

# Verificar configuración de VS Code
if [ -f ".vscode/settings.json" ]; then
    echo -e "${GREEN}✅ .vscode/settings.json encontrado${NC}"
    
    # Verificar configuraciones clave
    if grep -q "files.watcherExclude" .vscode/settings.json; then
        echo -e "${GREEN}✅ files.watcherExclude configurado${NC}"
    else
        echo -e "${RED}❌ files.watcherExclude no configurado${NC}"
    fi
    
    if grep -q "search.exclude" .vscode/settings.json; then
        echo -e "${GREEN}✅ search.exclude configurado${NC}"
    else
        echo -e "${RED}❌ search.exclude no configurado${NC}"
    fi
    
    if grep -q "typescript.disableAutomaticTypeAcquisition" .vscode/settings.json; then
        echo -e "${GREEN}✅ TypeScript automatic type acquisition deshabilitado${NC}"
    else
        echo -e "${YELLOW}⚠️  TypeScript automatic type acquisition no configurado${NC}"
    fi
    
    if grep -q '"editor.minimap.enabled": false' .vscode/settings.json; then
        echo -e "${GREEN}✅ Minimap deshabilitado${NC}"
    else
        echo -e "${YELLOW}⚠️  Minimap aún habilitado${NC}"
    fi
    
else
    echo -e "${RED}❌ .vscode/settings.json no encontrado${NC}"
fi

echo ""

# 3. ANÁLISIS DE PROCESOS
echo "🔍 ANÁLISIS DE PROCESOS ACTIVOS"
echo "==============================="
echo ""

# Verificar procesos de Cursor/VS Code
CURSOR_PROCESSES=$(ps aux | grep -i cursor | grep -v grep | wc -l)
VSCODE_PROCESSES=$(ps aux | grep -i "visual studio code" | grep -v grep | wc -l)
NODE_PROCESSES=$(ps aux | grep node | grep -v grep | wc -l)

echo "📊 Procesos detectados:"
echo "   Cursor: $CURSOR_PROCESSES procesos"
echo "   VS Code: $VSCODE_PROCESSES procesos"
echo "   Node.js: $NODE_PROCESSES procesos"

if [ $NODE_PROCESSES -gt 10 ]; then
    echo -e "${YELLOW}⚠️  Muchos procesos Node.js activos ($NODE_PROCESSES). Considera reiniciar Cursor.${NC}"
fi

echo ""

# 4. VERIFICACIÓN DE PUERTOS
echo "🌐 VERIFICACIÓN DE SERVICIOS"
echo "============================"
echo ""

# Verificar servicios del proyecto
echo "🔌 Estado de servicios CoomÜnity:"

# Backend
if curl -s http://localhost:1111/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend (3002): Funcionando${NC}"
else
    echo -e "${YELLOW}⚠️  Backend (3002): No disponible${NC}"
fi

# SuperApp
if curl -s -I http://localhost:2222 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ SuperApp (3001): Funcionando${NC}"
else
    echo -e "${YELLOW}⚠️  SuperApp (3001): No disponible${NC}"
fi

echo ""

# 5. RECOMENDACIONES
echo "💡 RECOMENDACIONES DE OPTIMIZACIÓN"
echo "=================================="
echo ""

echo "📋 Para mejorar el rendimiento de Cursor:"
echo ""
echo "1. 🔄 REINICIA CURSOR:"
echo "   - Cierra completamente Cursor"
echo "   - Espera 5 segundos"
echo "   - Vuelve a abrir el proyecto"
echo ""
echo "2. 🧹 LIMPIEZA DE PROCESOS:"
echo "   pkill -f 'Cursor'"
echo "   pkill -f 'node'"
echo ""
echo "3. 📊 MONITOREO EN CURSOR:"
echo "   - Abre la Paleta de Comandos (Cmd+Shift+P)"
echo "   - Ejecuta: 'Developer: Show Running Extensions'"
echo "   - Busca extensiones con tiempo de arranque > 200ms"
echo ""
echo "4. 🔧 COMANDOS DE DIAGNÓSTICO:"
echo "   - 'Developer: Startup Performance' para análisis completo"
echo "   - 'Help > Open Process Explorer' para procesos activos"
echo ""
echo "5. 🎯 EXTENSIONES:"
echo "   - Deshabilita extensiones pesadas para este workspace"
echo "   - Usa 'Disable (Workspace)' en lugar de desinstalar"
echo ""

# 6. CONFIGURACIÓN AUTOMÁTICA
echo "⚡ APLICAR OPTIMIZACIONES AUTOMÁTICAS"
echo "===================================="
echo ""

read -p "¿Quieres aplicar las optimizaciones automáticamente? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Aplicando optimizaciones..."
    
    # Limpiar procesos conflictivos
    echo "🧹 Limpiando procesos..."
    pkill -f "vite" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    sleep 2
    
    # Limpiar node_modules corruptos si existen
    if [ -d "Demo/apps/superapp-unified/node_modules" ]; then
        echo "🔄 Verificando integridad de node_modules..."
        cd Demo/apps/superapp-unified
        npm ls >/dev/null 2>&1 || {
            echo "⚠️  Detectados node_modules corruptos, limpiando..."
            rm -rf node_modules
            npm install --legacy-peer-deps
        }
        cd ../../
    fi
    
    echo -e "${GREEN}✅ Optimizaciones aplicadas${NC}"
    echo ""
    echo "🎉 ¡Cursor debería estar más rápido ahora!"
    echo "   Reinicia Cursor para ver el efecto completo."
else
    echo "ℹ️  Optimizaciones no aplicadas"
fi

echo ""
echo "🏁 Diagnóstico completado"
echo "========================"
echo "📈 Para mejores resultados:"
echo "   1. Reinicia Cursor después de estas optimizaciones"
echo "   2. Monitorea el rendimiento con las herramientas integradas"
echo "   3. Ejecuta este script semanalmente"
echo ""
echo "📚 Más información:"
echo "   - Documentación VS Code Performance: https://code.visualstudio.com/docs/supporting/faq#_vs-code-is-consuming-a-lot-of-cpu"
echo "   - Cursor Docs: https://docs.cursor.com/" 