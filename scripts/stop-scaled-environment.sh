#!/bin/bash

echo "🛑 Deteniendo entorno escalado CoomÜnity..."

cd infrastructure/scalability

# Detener servicios
docker-compose -f docker-compose-scale.yml down

echo "✅ Entorno escalado detenido exitosamente!"
