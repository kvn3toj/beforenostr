#!/bin/bash

echo "🚀 Iniciando entorno escalado CoomÜnity..."

cd infrastructure/scalability

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor, inicia Docker Desktop."
    exit 1
fi

# Iniciar servicios
echo "📦 Iniciando servicios con Docker Compose..."
docker-compose -f docker-compose-scale.yml up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."
docker-compose -f docker-compose-scale.yml ps

echo ""
echo "✅ Entorno escalado iniciado exitosamente!"
echo ""
echo "📋 Servicios disponibles:"
echo "- Load Balancer: http://localhost:8080"
echo "- Prometheus: http://localhost:9091"
echo "- Grafana: http://localhost:3003 (admin/coomunity2025)"
echo "- Redis: localhost:6380"
echo "- PostgreSQL: localhost:5433"
echo ""
echo "🔧 Para detener: ./scripts/stop-scaled-environment.sh"
