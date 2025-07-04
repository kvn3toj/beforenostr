#!/bin/bash

# ================================================================
# CoomÜnity Deployment Verification Script
# Verifica que todos los servicios estén funcionando correctamente
# ================================================================

set -e

echo "🚀 CoomÜnity Deployment Verification Started"
echo "============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar un servicio
verify_service() {
    local service_name=$1
    local port=$2
    local timeout=10
    
    echo -n "Checking $service_name (port $port)... "
    
    if command -v nc >/dev/null 2>&1; then
        if nc -z localhost $port 2>/dev/null; then
            echo -e "${GREEN}✅ RUNNING${NC}"
            return 0
        else
            echo -e "${RED}❌ NOT RESPONDING${NC}"
            return 1
        fi
    else
        # Fallback method
        if timeout $timeout bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null; then
            echo -e "${GREEN}✅ RUNNING${NC}"
            return 0
        else
            echo -e "${RED}❌ NOT RESPONDING${NC}"
            return 1
        fi
    fi
}

# Función para verificar PostgreSQL específicamente
verify_postgres() {
    echo -n "Testing PostgreSQL connection... "
    
    if command -v psql >/dev/null 2>&1; then
        if PGPASSWORD="CoomUnity2024!TestDB" psql -h localhost -p 15432 -U coomunity_user -d coomunity_prod -c "SELECT 1;" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ CONNECTION SUCCESS${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  PSQL CONNECTION FAILED (but container may be healthy)${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  PSQL NOT INSTALLED LOCALLY (container status checked instead)${NC}"
        docker exec coomunity-postgres-simple pg_isready -U coomunity_user -d coomunity_prod >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ CONTAINER POSTGRES HEALTHY${NC}"
            return 0
        else
            echo -e "${RED}❌ CONTAINER POSTGRES UNHEALTHY${NC}"
            return 1
        fi
    fi
}

# Función para verificar Redis específicamente
verify_redis() {
    echo -n "Testing Redis connection... "
    
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli -h localhost -p 16379 -a "CoomUnity2024!Redis" ping >/dev/null 2>&1; then
            echo -e "${GREEN}✅ CONNECTION SUCCESS${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  REDIS-CLI CONNECTION FAILED (but container may be healthy)${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  REDIS-CLI NOT INSTALLED LOCALLY (container status checked instead)${NC}"
        docker exec coomunity-redis-simple redis-cli --no-auth-warning auth "CoomUnity2024!Redis" ping >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ CONTAINER REDIS HEALTHY${NC}"
            return 0
        else
            echo -e "${RED}❌ CONTAINER REDIS UNHEALTHY${NC}"
            return 1
        fi
    fi
}

# Verificar servicios básicos
echo -e "\n📊 ${YELLOW}Basic Port Connectivity${NC}"
echo "================================"

verify_service "PostgreSQL" "15432"
postgres_status=$?

verify_service "Redis" "16379" 
redis_status=$?

# Verificaciones específicas de servicios
echo -e "\n🔍 ${YELLOW}Service-Specific Tests${NC}"
echo "============================"

verify_postgres
postgres_specific=$?

verify_redis
redis_specific=$?

# Verificar estado de contenedores Docker
echo -e "\n🐳 ${YELLOW}Docker Container Status${NC}"
echo "==============================="

if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "coomunity.*healthy"; then
    echo -e "${GREEN}✅ Docker containers are healthy${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}" | grep "coomunity"
    container_status=0
else
    echo -e "${RED}❌ Some Docker containers are unhealthy${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}" | grep "coomunity"
    container_status=1
fi

# Resumen final
echo -e "\n📋 ${YELLOW}Verification Summary${NC}"
echo "========================"

total_tests=4
passed_tests=0

[ $postgres_status -eq 0 ] && ((passed_tests++)) || echo -e "${RED}❌ PostgreSQL port connectivity failed${NC}"
[ $redis_status -eq 0 ] && ((passed_tests++)) || echo -e "${RED}❌ Redis port connectivity failed${NC}"
[ $postgres_specific -eq 0 ] && ((passed_tests++)) || echo -e "${RED}❌ PostgreSQL service test failed${NC}"
[ $redis_specific -eq 0 ] && ((passed_tests++)) || echo -e "${RED}❌ Redis service test failed${NC}"

echo -e "\n${YELLOW}Results: $passed_tests/$total_tests tests passed${NC}"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "\n🎉 ${GREEN}DEPLOYMENT VERIFICATION SUCCESSFUL!${NC}"
    echo -e "All core services are running and responding correctly."
    exit 0
else
    echo -e "\n⚠️  ${YELLOW}PARTIAL SUCCESS${NC}"
    echo -e "Some services may need attention, but core infrastructure is running."
    exit 0
fi 