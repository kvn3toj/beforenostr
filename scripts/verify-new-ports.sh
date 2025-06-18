#!/bin/bash

# 🔍 Script de Verificación de Nuevos Puertos CoomÜnity
# Verifica que todos los servicios respondan en los puertos correctos

echo "🔍 Verificando nuevos puertos del ecosistema CoomÜnity..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_service() {
    local name="$1"
    local port="$2"
    local endpoint="$3"
    
    echo -n "📡 Verificando $name (puerto $port)... "
    
    if curl -s -f "http://localhost:$port$endpoint" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ NO RESPONDE${NC}"
        return 1
    fi
}

echo "🚀 Verificando servicios en nuevos puertos:"
echo ""

# Check Backend
check_service "Backend NestJS" "1111" "/health"
backend_status=$?

# Check SuperApp  
check_service "SuperApp Frontend" "2222" "/"
superapp_status=$?

# Check Admin
check_service "Admin Frontend" "3333" "/"
admin_status=$?

echo ""
echo "📊 Resumen de verificación:"
echo ""

if [ $backend_status -eq 0 ]; then
    echo -e "⚙️  Backend: ${GREEN}✅ Funcionando en http://localhost:1111${NC}"
else
    echo -e "⚙️  Backend: ${RED}❌ No responde en puerto 1111${NC}"
fi

if [ $superapp_status -eq 0 ]; then
    echo -e "🎮 SuperApp: ${GREEN}✅ Funcionando en http://localhost:2222${NC}"
else
    echo -e "🎮 SuperApp: ${RED}❌ No responde en puerto 2222${NC}"
fi

if [ $admin_status -eq 0 ]; then
    echo -e "🔧 Admin: ${GREEN}✅ Funcionando en http://localhost:3333${NC}"
else
    echo -e "🔧 Admin: ${RED}❌ No responde en puerto 3333${NC}"
fi

echo ""

# Overall status
if [ $backend_status -eq 0 ] && [ $superapp_status -eq 0 ] && [ $admin_status -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Todos los servicios funcionando correctamente con nuevos puertos!${NC}"
    echo ""
    echo "🔗 Enlaces de acceso:"
    echo "   📋 Admin Panel: http://localhost:3333"
    echo "   🎮 SuperApp: http://localhost:2222"  
    echo "   📚 API Docs: http://localhost:1111/api"
    exit 0
else
    echo -e "${YELLOW}⚠️  Algunos servicios no están respondiendo${NC}"
    echo ""
    echo "💡 Para iniciar todos los servicios:"
    echo "   npm run dev"
    exit 1
fi