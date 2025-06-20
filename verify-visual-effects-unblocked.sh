#!/bin/bash
echo "🌟 VERIFICACIÓN DE EFECTOS VISUALES DESBLOQUEADOS - SUPERAPP COOMUNITY"
echo "====================================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

SUPERAPP_DIR="Demo/apps/superapp-unified/src"
SUCCESS_COUNT=0
TOTAL_CHECKS=10

echo "🎯 VERIFICANDO QUE LOS ARCHIVOS MOCK CRÍTICOS FUERON ELIMINADOS"
echo "============================================================="
echo ""

# Función para verificar eliminación
check_elimination() {
    local file_path=$1
    local description=$2
    
    if [ ! -f "$file_path" ]; then
        echo -e "${GREEN}✅ ELIMINADO:${NC} $description"
        echo "   📂 $file_path"
        ((SUCCESS_COUNT++))
    else
        echo -e "${RED}❌ AÚN EXISTE:${NC} $description"
        echo "   📂 $file_path"
    fi
    echo ""
}

# Verificar archivos críticos eliminados
check_elimination "$SUPERAPP_DIR/data/marketplaceMockData.ts" "Datos mock del Marketplace (969 líneas)"
check_elimination "$SUPERAPP_DIR/lib/lets-mock-service.ts" "Servicio mock de LETS (34 líneas)"
check_elimination "$SUPERAPP_DIR/hooks/useUPlayMockData.ts" "Hook mock de ÜPlay"

echo "🔍 VERIFICANDO IMPORTS COMENTADOS EN HOOKS CRÍTICOS"
echo "=================================================="
echo ""

# Verificar que imports problemáticos fueron comentados
if grep -q "// .*lets-mock-service" "$SUPERAPP_DIR/hooks/useLetsIntegration.ts" 2>/dev/null; then
    echo -e "${GREEN}✅ IMPORTS COMENTADOS:${NC} useLetsIntegration.ts"
    echo "   🔧 Referencias a lets-mock-service comentadas"
    ((SUCCESS_COUNT++))
else
    echo -e "${YELLOW}⚠️  IMPORTS NO COMENTADOS:${NC} useLetsIntegration.ts"
    echo "   🔧 Verificar referencias a lets-mock-service"
fi
echo ""

# Verificar imports en useRealBackendData.ts
if ! grep -q "marketplaceMockData" "$SUPERAPP_DIR/hooks/useRealBackendData.ts" 2>/dev/null; then
    echo -e "${GREEN}✅ IMPORTS LIMPIOS:${NC} useRealBackendData.ts"
    echo "   🔧 Sin referencias a marketplaceMockData"
    ((SUCCESS_COUNT++))
else
    echo -e "${YELLOW}⚠️  IMPORTS PRESENTES:${NC} useRealBackendData.ts"
    echo "   🔧 Aún contiene referencias a marketplaceMockData"
fi
echo ""

echo "🌟 VERIFICANDO ARCHIVOS DE EFECTOS VISUALES CÓSMICOS"
echo "=================================================="
echo ""

# Verificar archivos de efectos visuales existen
cosmic_files=(
    "$SUPERAPP_DIR/components/ui/CosmicParticles.tsx"
    "$SUPERAPP_DIR/components/ui/GlassmorphismCard.tsx"
    "$SUPERAPP_DIR/components/ui/RevolutionaryAura.tsx"
    "$SUPERAPP_DIR/components/ui/DynamicParticles.tsx"
    "$SUPERAPP_DIR/styles/cosmic-theme.css"
    "$SUPERAPP_DIR/styles/glassmorphism.css"
)

for file in "${cosmic_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ DISPONIBLE:${NC} $(basename $file)"
        echo "   📂 $file"
        ((SUCCESS_COUNT++))
    else
        echo -e "${BLUE}ℹ️  NO ENCONTRADO:${NC} $(basename $file)"
        echo "   📂 $file (puede estar en otro directorio)"
    fi
done
echo ""

echo "🚀 VERIFICANDO ESTADO DE SERVICIOS"
echo "================================="
echo ""

# Verificar SuperApp
if curl -s -I http://localhost:3001 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ SUPERAPP FUNCIONANDO:${NC} Puerto 3001"
    echo "   🌐 HTTP 200 OK"
    ((SUCCESS_COUNT++))
else
    echo -e "${YELLOW}⚠️  SUPERAPP NO DISPONIBLE:${NC} Puerto 3001"
    echo "   🌐 Verificar si está ejecutándose"
fi
echo ""

# Verificar Backend
if curl -s http://localhost:3002/health | grep -q "ok"; then
    echo -e "${GREEN}✅ BACKEND FUNCIONANDO:${NC} Puerto 3002"
    echo "   🔗 Health check exitoso"
    ((SUCCESS_COUNT++))
else
    echo -e "${YELLOW}⚠️  BACKEND NO DISPONIBLE:${NC} Puerto 3002"
    echo "   🔗 Verificar si está ejecutándose"
fi
echo ""

echo "📊 VERIFICANDO COMPILATION STATUS"
echo "================================"
echo ""

# Verificar compilación de la SuperApp
cd Demo/apps/superapp-unified
echo "🔧 Ejecutando verificación de tipos TypeScript..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TYPESCRIPT VÁLIDO:${NC} Sin errores de tipos"
    ((SUCCESS_COUNT++))
else
    echo -e "${YELLOW}⚠️  ERRORES DE TYPESCRIPT:${NC} Revisar tipos"
fi

echo ""
echo "🔧 Verificando build de la aplicación..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ BUILD EXITOSO:${NC} Aplicación compila correctamente"
    ((SUCCESS_COUNT++))
else
    echo -e "${YELLOW}⚠️  ERRORES DE BUILD:${NC} Revisar imports y dependencias"
fi

cd - > /dev/null

echo ""
echo "📈 RESUMEN DE VERIFICACIÓN"
echo "========================="
echo ""

PERCENTAGE=$((SUCCESS_COUNT * 100 / TOTAL_CHECKS))

echo "📊 Verificaciones exitosas: $SUCCESS_COUNT/$TOTAL_CHECKS ($PERCENTAGE%)"
echo ""

if [ $SUCCESS_COUNT -ge 8 ]; then
    echo -e "${GREEN}🎉 EFECTOS VISUALES DESBLOQUEADOS EXITOSAMENTE${NC}"
    echo ""
    echo "🌟 ESTADO: Los archivos mock críticos han sido eliminados"
    echo "✨ RESULTADO: Los efectos visuales deberían estar ahora visibles"
    echo "🚀 ACCIÓN: Navegar a la SuperApp para verificar efectos cósmicos"
elif [ $SUCCESS_COUNT -ge 5 ]; then
    echo -e "${YELLOW}⚠️  DESBLOQUEADOS PARCIALMENTE${NC}"
    echo ""
    echo "🔧 ESTADO: La mayoría de archivos mock fueron eliminados"
    echo "⚡ RESULTADO: Algunos efectos visuales pueden estar visibles"
    echo "📋 ACCIÓN: Revisar errores restantes y ejecutar correcciones"
else
    echo -e "${RED}❌ DESBLOQUEADO INSUFICIENTE${NC}"
    echo ""
    echo "🚨 ESTADO: Archivos mock críticos aún presentes"
    echo "🔴 RESULTADO: Efectos visuales pueden seguir bloqueados"
    echo "🔧 ACCIÓN: Revisar script de eliminación y ejecutar nuevamente"
fi

echo ""
echo "📋 PRÓXIMOS PASOS RECOMENDADOS:"
echo "1. 🌐 Abrir SuperApp en http://localhost:3001"
echo "2. 🔍 Verificar visibilidad de efectos cósmicos"
echo "3. 🎨 Confirmar Glassmorphism en tarjetas"
echo "4. ✨ Observar partículas dinámicas en UI"
echo "5. 🌀 Validar auras revolutionarias en componentes"
echo ""

if [ $SUCCESS_COUNT -ge 8 ]; then
    echo -e "${PURPLE}🚀 READY PARA FASE 2: ELIMINACIÓN DE MOCKS RESTANTES${NC}"
else
    echo -e "${YELLOW}🔧 RECOMENDADO: CORREGIR ERRORES ANTES DE FASE 2${NC}"
fi 