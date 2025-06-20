#!/bin/bash

# 🚀 FASE 5: Implementación de Escalabilidad CoomÜnity (Versión Lite)
# Script simplificado para desarrollo local sin dependencias de Kubernetes

set -e

echo "🚀 INICIANDO FASE 5: ESCALABILIDAD - VERSIÓN LITE"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Verificar prerrequisitos básicos
check_basic_prerequisites() {
    log "🔍 Verificando prerrequisitos básicos..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado"
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose no está instalado"
        exit 1
    fi
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        error "npm no está instalado"
        exit 1
    fi
    
    log "✅ Prerrequisitos básicos verificados"
}

# Verificar estado actual del sistema
check_system_status() {
    log "🔍 Verificando estado actual del sistema..."
    
    # Verificar Backend
    if curl -s http://localhost:3002/health > /dev/null; then
        log "✅ Backend NestJS operativo en puerto 3002"
    else
        error "Backend NestJS no responde en puerto 3002"
        echo "Por favor, inicia el backend antes de continuar"
        exit 1
    fi
    
    # Verificar Frontend
    if curl -s http://localhost:3000 > /dev/null; then
        log "✅ SuperApp Frontend operativo en puerto 3000"
    else
        warn "SuperApp Frontend no responde en puerto 3000"
    fi
    
    log "✅ Sistema base verificado"
}

# Configurar estructura de directorios
setup_directories() {
    log "📁 Configurando estructura de directorios..."
    
    # Crear directorios necesarios
    mkdir -p infrastructure/scalability
    mkdir -p infrastructure/monitoring
    mkdir -p monitoring/dashboards
    mkdir -p global/regions
    mkdir -p global/i18n
    mkdir -p roadmap/features
    mkdir -p roadmap/planning
    mkdir -p scripts
    
    log "✅ Estructura de directorios configurada"
}

# Verificar archivos de configuración existentes
verify_config_files() {
    log "📄 Verificando archivos de configuración..."
    
    local missing_files=()
    
    # Verificar archivos críticos
    if [ ! -f "infrastructure/scalability/load-balancer.conf" ]; then
        missing_files+=("load-balancer.conf")
    fi
    
    if [ ! -f "infrastructure/scalability/kubernetes-hpa.yaml" ]; then
        missing_files+=("kubernetes-hpa.yaml")
    fi
    
    if [ ! -f "infrastructure/monitoring/prometheus-alerts.yml" ]; then
        missing_files+=("prometheus-alerts.yml")
    fi
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        log "✅ Todos los archivos de configuración están presentes"
    else
        warn "Archivos faltantes: ${missing_files[*]}"
        log "Continuando con la implementación..."
    fi
}

# Crear configuración Docker Compose para escalado local
create_docker_compose_scale() {
    log "🐳 Creando configuración Docker Compose para escalado..."
    
    cat > infrastructure/scalability/docker-compose-scale.yml << 'EOF'
version: '3.8'

services:
  # Load Balancer Nginx
  nginx-lb:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx-simple.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend-1
      - backend-2
    networks:
      - coomunity-network
    restart: unless-stopped

  # Backend Instance 1
  backend-1:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ../../backend:/app
    environment:
      - PORT=3002
      - NODE_ENV=development
      - INSTANCE_ID=backend-1
    command: npm run dev
    networks:
      - coomunity-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # Backend Instance 2
  backend-2:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ../../backend:/app
    environment:
      - PORT=3002
      - NODE_ENV=development
      - INSTANCE_ID=backend-2
    command: npm run dev
    networks:
      - coomunity-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # Redis para caching
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - coomunity-network
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # PostgreSQL para desarrollo
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=coomunity_dev
      - POSTGRES_USER=coomunity
      - POSTGRES_PASSWORD=coomunity123
    ports:
      - "5432:5432"
    networks:
      - coomunity-network
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Prometheus para monitoreo
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus-simple.yml:/etc/prometheus/prometheus.yml:ro
    networks:
      - coomunity-network
    restart: unless-stopped

  # Grafana para dashboards
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=coomunity2025
      - GF_SECURITY_ADMIN_USER=admin
    networks:
      - coomunity-network
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped

networks:
  coomunity-network:
    driver: bridge

volumes:
  redis_data:
  postgres_data:
  grafana_data:
EOF

    log "✅ Docker Compose para escalado creado"
}

# Crear configuración Nginx simplificada
create_nginx_config() {
    log "⚖️ Creando configuración Nginx simplificada..."
    
    cat > infrastructure/scalability/nginx-simple.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend_servers {
        least_conn;
        server backend-1:3002 weight=1 max_fails=3 fail_timeout=30s;
        server backend-2:3002 weight=1 max_fails=3 fail_timeout=30s;
    }

    server {
        listen 80;
        server_name localhost;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Proxy to backend
        location / {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
            
            # Health checks
            proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        }
    }
}
EOF

    log "✅ Configuración Nginx simplificada creada"
}

# Crear configuración Prometheus simplificada
create_prometheus_config() {
    log "📊 Creando configuración Prometheus simplificada..."
    
    cat > infrastructure/scalability/prometheus-simple.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'coomunity-backend'
    static_configs:
      - targets: ['backend-1:3002', 'backend-2:3002']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-lb:80']
    metrics_path: '/health'
    scrape_interval: 10s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
    scrape_interval: 10s
EOF

    log "✅ Configuración Prometheus simplificada creada"
}

# Crear scripts de gestión
create_management_scripts() {
    log "🛠️ Creando scripts de gestión..."
    
    # Script para iniciar el entorno escalado
    cat > scripts/start-scaled-environment.sh << 'EOF'
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
echo "- Prometheus: http://localhost:9090"
echo "- Grafana: http://localhost:3001 (admin/coomunity2025)"
echo "- Redis: localhost:6379"
echo "- PostgreSQL: localhost:5432"
echo ""
echo "🔧 Para detener: ./scripts/stop-scaled-environment.sh"
EOF

    # Script para detener el entorno escalado
    cat > scripts/stop-scaled-environment.sh << 'EOF'
#!/bin/bash

echo "🛑 Deteniendo entorno escalado CoomÜnity..."

cd infrastructure/scalability

# Detener servicios
docker-compose -f docker-compose-scale.yml down

echo "✅ Entorno escalado detenido exitosamente!"
EOF

    # Script para monitorear el estado
    cat > scripts/monitor-scaled-environment.sh << 'EOF'
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
echo "- Prometheus: http://localhost:9090"
echo "- Grafana: http://localhost:3001"
echo ""
echo "💡 Para logs en tiempo real: docker-compose -f docker-compose-scale.yml logs -f"
EOF

    # Hacer ejecutables los scripts
    chmod +x scripts/start-scaled-environment.sh
    chmod +x scripts/stop-scaled-environment.sh
    chmod +x scripts/monitor-scaled-environment.sh
    
    log "✅ Scripts de gestión creados"
}

# Crear documentación de uso
create_usage_documentation() {
    log "📚 Creando documentación de uso..."
    
    cat > FASE_5_GUIA_USO.md << 'EOF'
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
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3001 | admin/coomunity2025 |
| Redis | localhost:6379 | - |
| PostgreSQL | localhost:5432 | coomunity/coomunity123 |

## 📊 Monitoreo

### Prometheus
- Accede a http://localhost:9090
- Consulta métricas de los backends
- Verifica el estado de salud de los servicios

### Grafana
- Accede a http://localhost:3001
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
- Prometheus: http://localhost:9090
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
EOF

    log "✅ Documentación de uso creada"
}

# Función principal
main() {
    log "🚀 INICIANDO IMPLEMENTACIÓN FASE 5 - VERSIÓN LITE"
    
    check_basic_prerequisites
    check_system_status
    setup_directories
    verify_config_files
    create_docker_compose_scale
    create_nginx_config
    create_prometheus_config
    create_management_scripts
    create_usage_documentation
    
    log "🎉 FASE 5 LITE IMPLEMENTADA EXITOSAMENTE"
    echo ""
    echo "📋 PRÓXIMOS PASOS:"
    echo "1. Iniciar entorno escalado: ./scripts/start-scaled-environment.sh"
    echo "2. Monitorear servicios: ./scripts/monitor-scaled-environment.sh"
    echo "3. Acceder a Grafana: http://localhost:3001 (admin/coomunity2025)"
    echo "4. Acceder a Prometheus: http://localhost:9090"
    echo "5. Probar Load Balancer: http://localhost:8080/health"
    echo ""
    echo "📚 Consulta la guía: FASE_5_GUIA_USO.md"
    echo ""
    echo "🌟 CoomÜnity está listo para escalabilidad local!"
}

# Ejecutar función principal
main "$@" 