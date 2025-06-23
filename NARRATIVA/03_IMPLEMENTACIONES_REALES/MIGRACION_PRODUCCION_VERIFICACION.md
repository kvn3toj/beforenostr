# 🚀 VERIFICACIÓN DE MIGRACIÓN A PRODUCCIÓN

## Servicios Operativos

### ✅ Verificar Load Balancer
```bash
curl http://localhost:8080/health
# Debe responder: "healthy"
```

### ✅ Verificar Backend Real
```bash
curl http://localhost:8080/api/health
# Debe responder con datos del backend NestJS
```

### ✅ Verificar Prometheus
```bash
curl http://localhost:9091/-/healthy
# Debe responder: Prometheus is Healthy
```

### ✅ Verificar Grafana
- Abrir: http://localhost:3003
- Usuario: admin
- Contraseña: coomunity2025

### ✅ Verificar Base de Datos
```bash
docker exec -it scalability-postgres-1 psql -U coomunity -d coomunity_production -c "SELECT version();"
```

## Métricas de CoomÜnity

### Ayni Score Global
```bash
curl "http://localhost:9091/api/v1/query?query=ayni_balance_score"
```

### Bien Común Rate
```bash
curl "http://localhost:9091/api/v1/query?query=bien_comun_contributions_rate"
```

## Testing de Carga

### Instalar Artillery
```bash
npm install -g artillery
```

### Test Básico
```bash
artillery quick --count 100 --num 10 http://localhost:8080/health
```

## Próximos Pasos

1. ✅ Migración completada
2. 🔄 Configurar métricas personalizadas
3. 🧪 Ejecutar testing de carga
4. 🚀 Preparar para lanzamiento regional
