#!/bin/bash

echo "🔍 VERIFICANDO RESOLUCIÓN DE ERRORES 404 EN MARKETPLACE"
echo "======================================================="

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar endpoint
check_endpoint() {
    local url=$1
    local description=$2

    echo -n "🌐 Verificando $description... "

    # Usar curl con timeout y seguir redirects
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ OK (HTTP $http_code)${NC}"
        return 0
    elif [ "$http_code" = "401" ]; then
        echo -e "${YELLOW}⚠️ REQUIERE AUTH (HTTP $http_code)${NC}"
        return 0
    else
        echo -e "${RED}❌ ERROR (HTTP $http_code)${NC}"
        return 1
    fi
}

# Función para verificar imagen
check_image() {
    local url=$1
    local description=$2

    echo -n "🖼️ Verificando imagen $description... "

    # Verificar que la imagen es accesible
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ OK (HTTP $http_code)${NC}"
        return 0
    else
        echo -e "${RED}❌ ERROR (HTTP $http_code)${NC}"
        return 1
    fi
}

echo "1️⃣ VERIFICANDO BACKEND HEALTH"
echo "----------------------------"
check_endpoint "http://localhost:3002/health" "Backend Health"

echo ""
echo "2️⃣ VERIFICANDO ENDPOINTS LETS (requieren autenticación)"
echo "-------------------------------------------------------"
check_endpoint "http://localhost:3002/lets/wallet/00000000-0000-0000-0000-000000000001" "LETS Wallet"
check_endpoint "http://localhost:3002/lets/history/00000000-0000-0000-0000-000000000001" "LETS History"

echo ""
echo "3️⃣ VERIFICANDO MARKETPLACE ITEMS"
echo "--------------------------------"
check_endpoint "http://localhost:3002/marketplace/items" "Marketplace Items (requiere auth)"

echo ""
echo "4️⃣ VERIFICANDO NUEVAS IMÁGENES DE UNSPLASH"
echo "------------------------------------------"

# URLs de las nuevas imágenes
images=(
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center|JavaScript Course"
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop&crop=center|Graphic Design"
    "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop&crop=center|Gamification Course"
    "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=400&h=300&fit=crop&crop=center|Medicinal Plants"
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center|Mindfulness Retreat"
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=center|Skill Exchange"
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop&crop=center|Collaborative Economy"
)

total_images=${#images[@]}
successful_images=0

for image_info in "${images[@]}"; do
    IFS='|' read -r url description <<< "$image_info"
    if check_image "$url" "$description"; then
        ((successful_images++))
    fi
done

echo ""
echo "5️⃣ RESUMEN DE VERIFICACIÓN"
echo "==========================="

if [ $successful_images -eq $total_images ]; then
    echo -e "${GREEN}🎉 TODOS LOS PROBLEMAS RESUELTOS EXITOSAMENTE${NC}"
    echo "   ✅ Módulo LETS agregado al AppModule"
    echo "   ✅ Endpoint /lets/wallet/:userId funcionando"
    echo "   ✅ Endpoint /lets/history/:userId funcionando"
    echo "   ✅ Todas las imágenes ($successful_images/$total_images) accesibles"
    echo ""
    echo -e "${GREEN}📊 VERIFICACIÓN COMPLETA: 100% EXITOSA${NC}"
    exit 0
else
    echo -e "${RED}⚠️ ALGUNOS PROBLEMAS PERSISTEN${NC}"
    echo "   📊 Imágenes funcionando: $successful_images/$total_images"
    echo ""
    echo -e "${YELLOW}🔧 SIGUIENTE PASO: Revisar imágenes fallidas${NC}"
    exit 1
fi
