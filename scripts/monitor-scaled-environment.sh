#!/bin/bash

echo "📊 Monitoreando entorno escalado CoomÜnity..."

cd infrastructure/scalability

echo "🔍 Estado de los contenedores:"
docker-compose -f docker-compose-scale.yml ps

echo ""
echo "📈 Logs recientes del Load Balancer:"
docker-compose -f docker-compose-scale.yml logs --tail=10 nginx-lb

echo ""
echo "🔗 Enlaces útiles:"
echo "- Load Balancer: http://localhost:8080"
echo "- Prometheus: http://localhost:9091"
echo "- Grafana: http://localhost:3003"
echo ""
echo "💡 Para logs en tiempo real: docker-compose -f docker-compose-scale.yml logs -f"
