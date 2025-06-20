#!/bin/bash

echo "🧪 VERIFICACIÓN COMPLETA DE INTEGRACIÓN SUPABASE"
echo "================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SUCCESS_COUNT=0
TOTAL_TESTS=10

check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((SUCCESS_COUNT++))
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo -e "${BLUE}1. Verificando configuración de variables de entorno...${NC}"
if [ -f "Demo/apps/superapp-unified/.env.local" ]; then
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" Demo/apps/superapp-unified/.env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" Demo/apps/superapp-unified/.env.local; then
        check_result 0 "Variables de entorno configuradas"
    else
        check_result 1 "Variables de entorno incompletas"
    fi
else
    check_result 1 "Archivo .env.local no encontrado"
fi

echo -e "${BLUE}2. Verificando instalación del cliente Supabase...${NC}"
cd Demo/apps/superapp-unified
if npm ls @supabase/supabase-js > /dev/null 2>&1; then
    check_result 0 "Cliente @supabase/supabase-js instalado"
else
    check_result 1 "Cliente @supabase/supabase-js no instalado"
fi
cd ../../..

echo -e "${BLUE}3. Verificando archivo de cliente Supabase...${NC}"
if [ -f "Demo/apps/superapp-unified/src/lib/supabase.ts" ]; then
    check_result 0 "Cliente supabase.ts creado"
else
    check_result 1 "Cliente supabase.ts no encontrado"
fi

echo -e "${BLUE}4. Verificando hook de autenticación...${NC}"
if [ -f "Demo/apps/superapp-unified/src/hooks/useSupabaseAuth.ts" ]; then
    check_result 0 "Hook useSupabaseAuth.ts creado"
else
    check_result 1 "Hook useSupabaseAuth.ts no encontrado"
fi

echo -e "${BLUE}5. Verificando componente de prueba...${NC}"
if [ -f "Demo/apps/superapp-unified/src/components/SupabaseTest.tsx" ]; then
    check_result 0 "Componente SupabaseTest.tsx creado"
else
    check_result 1 "Componente SupabaseTest.tsx no encontrado"
fi

echo -e "${BLUE}6. Verificando configuración de tipos...${NC}"
if [ -f "supabase/types.ts" ]; then
    check_result 0 "Tipos de TypeScript configurados"
else
    check_result 1 "Tipos de TypeScript no configurados"
fi

echo -e "${BLUE}7. Verificando configuración CLI de Supabase...${NC}"
if [ -f "supabase/config.toml" ] && [ -f "supabase/database.env" ]; then
    check_result 0 "CLI de Supabase configurado"
else
    check_result 1 "CLI de Supabase no configurado"
fi

echo -e "${BLUE}8. Verificando conectividad con Supabase...${NC}"
SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" Demo/apps/superapp-unified/.env.local | cut -d'=' -f2)
SUPABASE_ANON_KEY=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" Demo/apps/superapp-unified/.env.local | cut -d'=' -f2)

if curl -s "$SUPABASE_URL/rest/v1/" -H "apikey: $SUPABASE_ANON_KEY" | grep -q "swagger"; then
    check_result 0 "Conectividad con API de Supabase"
else
    check_result 1 "No se puede conectar con API de Supabase"
fi

echo -e "${BLUE}9. Verificando SuperApp ejecutándose...${NC}"
if lsof -i :3001 > /dev/null 2>&1; then
    check_result 0 "SuperApp ejecutándose en puerto 3001"
else
    check_result 1 "SuperApp no está ejecutándose"
fi

echo -e "${BLUE}10. Verificando página de prueba accesible...${NC}"
if curl -s http://localhost:3001/supabase-test | grep -q "CoomÜnity"; then
    check_result 0 "Página de prueba accesible"
else
    check_result 1 "Página de prueba no accesible"
fi

echo ""
echo "================================================="
echo -e "${YELLOW}📊 RESUMEN DE VERIFICACIÓN${NC}"
echo "================================================="
echo -e "Pruebas exitosas: ${GREEN}$SUCCESS_COUNT/$TOTAL_TESTS${NC}"

if [ $SUCCESS_COUNT -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}🎉 INTEGRACIÓN SUPABASE COMPLETAMENTE EXITOSA! 🎉${NC}"
    echo ""
    echo -e "${BLUE}✨ URLs Disponibles:${NC}"
    echo "   🌐 SuperApp: http://localhost:3001"
    echo "   🧪 Página de prueba: http://localhost:3001/supabase-test"
    echo "   📊 Dashboard Supabase: https://supabase.com/dashboard/project/huwbieukmudvbkhywgmi"
    echo ""
    echo -e "${BLUE}🚀 Próximos pasos sugeridos:${NC}"
    echo "   1. Acceder a la página de prueba y probar autenticación"
    echo "   2. Crear esquema de base de datos específico para CoomÜnity"
    echo "   3. Migrar datos existentes desde backend NestJS"
    echo "   4. Implementar Row Level Security (RLS)"
    echo "   5. Configurar políticas de acceso por roles"
    echo ""
elif [ $SUCCESS_COUNT -ge 8 ]; then
    echo -e "${YELLOW}⚠️ INTEGRACIÓN CASI COMPLETA (Minor issues)${NC}"
    echo "La mayoría de componentes están funcionando correctamente."
else
    echo -e "${RED}❌ INTEGRACIÓN INCOMPLETA${NC}"
    echo "Se requieren correcciones antes de continuar."
fi

echo ""
echo "================================================="
echo -e "${BLUE}Fecha de verificación: $(date)${NC}"
echo "================================================="
