# 🚀 Guía de Uso - Fase 5: Escalabilidad CoomÜnity

## 📋 Resumen

Esta guía te ayudará a usar el entorno escalado de CoomÜnity para desarrollo y testing.

## 🛠️ Comandos Principales

### Iniciar Entorno Escalado
```bash
./scripts/start-scaled-environment.sh
```

### Detener Entorno Escalado
```bash
./scripts/stop-scaled-environment.sh
```

### Monitorear Estado
```bash
./scripts/monitor-scaled-environment.sh
```

## 🌐 Servicios Disponibles

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Load Balancer | http://localhost:8080 | - |
| Prometheus | http://localhost:9091 | - |
| Grafana | http://localhost:3003 | admin/coomunity2025 |
| Redis | localhost:6380 | - |
| PostgreSQL | localhost:5433 | coomunity/coomunity123 |

## 📊 Monitoreo

### Prometheus
- Accede a http://localhost:9091
- Consulta métricas de los backends
- Verifica el estado de salud de los servicios

### Grafana
- Accede a http://localhost:3003
- Usuario: admin
- Contraseña: coomunity2025
- Importa dashboards personalizados

## 🧪 Testing de Carga

### Usando Artillery (si está instalado)
```bash
# Instalar Artillery globalmente
npm install -g artillery

# Ejecutar test de carga contra el load balancer
artillery quick --count 100 --num 10 http://localhost:8080/health
```

### Usando curl para testing básico
```bash
# Test simple de load balancer
for i in {1..10}; do
  curl -s http://localhost:8080/health
  echo " - Request $i"
done
```

## 🔧 Troubleshooting

### Verificar logs de servicios
```bash
cd infrastructure/scalability
docker-compose -f docker-compose-scale.yml logs [servicio]
```

### Reiniciar un servicio específico
```bash
cd infrastructure/scalability
docker-compose -f docker-compose-scale.yml restart [servicio]
```

### Verificar conectividad de red
```bash
docker network ls
docker network inspect scalability_coomunity-network
```

## 📈 Métricas Importantes

### Backend Health
- Endpoint: http://localhost:8080/health
- Debe retornar: "healthy"

### Load Balancer Stats
- Prometheus: http://localhost:9091
- Query: `up{job="nginx"}`

### Database Connections
- Verificar en logs de PostgreSQL
- Monitorear conexiones activas

## 🎯 Próximos Pasos

1. **Configurar métricas personalizadas** en el backend
2. **Crear dashboards específicos** en Grafana
3. **Implementar alertas** en Prometheus
4. **Optimizar configuración** según resultados de testing
5. **Documentar hallazgos** para producción

## 🆘 Soporte

Si encuentras problemas:
1. Verifica que Docker esté corriendo
2. Revisa los logs de los servicios
3. Verifica que los puertos no estén ocupados
4. Reinicia el entorno completo si es necesario

¡Disfruta escalando CoomÜnity! 🌟
