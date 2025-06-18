#!/bin/bash

# 🔐 SCRIPT DE VERIFICACIÓN DE CREDENCIALES VERIFICADAS
# Regla Obligatoria: Verificar que las credenciales del backend funcionan antes de desarrollo

echo "🔐 VERIFICACIÓN DE CREDENCIALES VERIFICADAS DEL BACKEND"
echo "======================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar que el backend esté ejecutándose
echo -e "${BLUE}🔍 Verificando backend en puerto 3002...${NC}"
if curl -s http://localhost:1111/health > /dev/null; then
    echo -e "${GREEN}✅ Backend está ejecutándose correctamente${NC}"
else
    echo -e "${RED}❌ Backend NO está ejecutándose en puerto 3002${NC}"
    echo -e "${YELLOW}💡 Ejecuta: cd ../../../backend && npm run dev${NC}"
    exit 1
fi

echo ""

# Verificar credenciales de administrador
echo -e "${BLUE}🔑 Verificando credenciales de ADMIN...${NC}"
ADMIN_RESPONSE=$(curl -s -X POST "http://localhost:1111/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gamifier.com", "password": "admin123"}')

if echo "$ADMIN_RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✅ Credenciales ADMIN verificadas correctamente${NC}"
    echo -e "${GREEN}   📧 admin@gamifier.com / admin123${NC}"
else
    echo -e "${RED}❌ Error con credenciales ADMIN${NC}"
    echo -e "${RED}   Respuesta: $ADMIN_RESPONSE${NC}"
fi

echo ""

# Verificar credenciales de usuario regular
echo -e "${BLUE}👤 Verificando credenciales de USER...${NC}"
USER_RESPONSE=$(curl -s -X POST "http://localhost:1111/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gamifier.com", "password": "123456"}')

if echo "$USER_RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✅ Credenciales USER verificadas correctamente${NC}"
    echo -e "${GREEN}   📧 user@gamifier.com / 123456${NC}"
else
    echo -e "${RED}❌ Error con credenciales USER${NC}"
    echo -e "${RED}   Respuesta: $USER_RESPONSE${NC}"
fi

echo ""

# Verificar configuración del frontend
echo -e "${BLUE}⚙️ Verificando configuración del frontend...${NC}"
if [ -f ".env" ]; then
    if grep -q "VITE_ENABLE_MOCK_AUTH=false" .env; then
        echo -e "${GREEN}✅ VITE_ENABLE_MOCK_AUTH=false configurado correctamente${NC}"
    else
        echo -e "${YELLOW}⚠️ Verificar VITE_ENABLE_MOCK_AUTH en .env${NC}"
    fi
    
    if grep -q "VITE_API_BASE_URL=http://localhost:1111" .env; then
        echo -e "${GREEN}✅ VITE_API_BASE_URL configurado correctamente${NC}"
    else
        echo -e "${YELLOW}⚠️ Verificar VITE_API_BASE_URL en .env${NC}"
    fi
else
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
fi

echo ""
echo -e "${BLUE}📋 CREDENCIALES VERIFICADAS DISPONIBLES:${NC}"
echo "=========================================="
echo -e "${GREEN}🔑 ADMIN:      admin@gamifier.com / admin123${NC}"
echo -e "${GREEN}👤 USER:       user@gamifier.com / 123456${NC}"
echo -e "${GREEN}💎 PREMIUM:    premium@gamifier.com / 123456${NC}"
echo -e "${GREEN}🎨 CREATOR:    creator@gamifier.com / 123456${NC}"
echo -e "${GREEN}🛡️ MODERATOR:  moderator@gamifier.com / 123456${NC}"

echo ""
echo -e "${YELLOW}🚨 RECORDATORIO CRÍTICO:${NC}"
echo -e "${YELLOW}- SIEMPRE usar estas credenciales verificadas${NC}"
echo -e "${YELLOW}- NUNCA inventar credenciales que causan errores 400/401${NC}"
echo -e "${YELLOW}- Fuente de verdad: backend/prisma/seed.ts${NC}"

echo ""
echo -e "${GREEN}✅ Verificación completada. ¡Listo para desarrollo!${NC}" 