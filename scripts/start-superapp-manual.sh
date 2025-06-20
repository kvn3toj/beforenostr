#!/bin/bash

echo "INICIO MANUAL SUPERAPP - RESOLVIENDO PROBLEMAS DE AUTENTICACION"
echo "==============================================================="

# 1. LIMPIAR PROCESOS CONFLICTIVOS
echo "1. Limpiando procesos conflictivos..."
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
sleep 2

# 2. LIBERAR PUERTOS
echo "2. Liberando puertos..."
lsof -ti:3001,3003,5173 | xargs kill -9 2>/dev/null || true
sleep 1

# 3. VERIFICAR BACKEND
echo "3. Verificando backend..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "   ✓ Backend NestJS funcionando en puerto 3002"
else
    echo "   ✗ Backend NestJS no responde - iniciar manualmente"
    exit 1
fi

# 4. LIMPIAR CACHE Y DEPENDENCIAS
echo "4. Limpiando cache de Vite..."
cd Demo/apps/superapp-unified
rm -rf .vite/ dist/ node_modules/.vite/ 2>/dev/null || true

# 5. CONFIGURAR VARIABLES DE ENTORNO
echo "5. Configurando variables de entorno..."
export PORT=3001
export VITE_API_BASE_URL=http://localhost:3002
export VITE_BASE_URL=http://localhost:3001

# 6. INICIAR SUPERAPP
echo "6. Iniciando SuperApp en puerto 3001..."
echo "   ⏳ Esto puede tomar unos segundos..."
npm run dev --port=3001

# El script termina aquí - el proceso quedará corriendo en foreground
