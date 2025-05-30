# 🚀 **GAMIFIER - Guía de Despliegue en Producción**

## 🎯 **Resumen de Infraestructura**

Esta guía describe cómo desplegar la **Gamifier API** en producción utilizando contenedores Docker y mejores prácticas de DevOps.

## 🏗️ **Arquitectura de Despliegue**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Gamifier API  │    │   PostgreSQL    │
│    (Nginx)      │◄──►│    (NestJS)     │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │    (Cache)      │
                       └─────────────────┘
```

## 📦 **Configuración de Docker**

### **Dockerfile Optimizado**

```dockerfile
# Dockerfile (ya existente, mejorado)
FROM node:18-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS runner

WORKDIR /app

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copiar archivos necesarios
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Cambiar a usuario no-root
USER nestjs

# Exponer puerto
EXPOSE 3002

# Comando de inicio
CMD ["node", "dist/main.js"]
```

### **docker-compose.yml para Producción**

```yaml
version: '3.8'

services:
  # Backend API
  gamifier-api:
    build: .
    container_name: gamifier-api
    restart: unless-stopped
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://gamifier:${DB_PASSWORD}@postgres:5432/gamifier
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - PORT=3002
    depends_on:
      - postgres
      - redis
    networks:
      - gamifier-network

  # Base de datos PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: gamifier-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=gamifier
      - POSTGRES_USER=gamifier
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    networks:
      - gamifier-network

  # Cache Redis
  redis:
    image: redis:7-alpine
    container_name: gamifier-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - gamifier-network

  # Load Balancer Nginx
  nginx:
    image: nginx:alpine
    container_name: gamifier-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - gamifier-api
    networks:
      - gamifier-network

volumes:
  postgres_data:
  redis_data:

networks:
  gamifier-network:
    driver: bridge
```

## 🔧 **Configuración de Nginx**

### **nginx.conf**

```nginx
events {
    worker_connections 1024;
}

http {
    upstream gamifier_api {
        server gamifier-api:3002;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        listen 80;
        server_name api.gamifier.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.gamifier.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://gamifier_api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check
        location /health {
            proxy_pass http://gamifier_api;
            access_log off;
        }

        # Swagger documentation
        location /api {
            proxy_pass http://gamifier_api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 🔐 **Variables de Entorno de Producción**

### **.env.production**

```env
# Database
DATABASE_URL=postgresql://gamifier:SECURE_PASSWORD@postgres:5432/gamifier

# Security
JWT_SECRET=SUPER_SECURE_JWT_SECRET_256_BITS
NODE_ENV=production

# Cache
REDIS_URL=redis://redis:6379

# Application
PORT=3002
API_PREFIX=api/v1

# External Services
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# Monitoring
LOG_LEVEL=warn
ENABLE_METRICS=true
```

## 🚀 **Comandos de Despliegue**

### **1. Preparación del Entorno**

```bash
# Clonar repositorio
git clone <repository-url>
cd gamifier

# Configurar variables de entorno
cp .env.example .env.production
# Editar .env.production con valores reales

# Generar certificados SSL (desarrollo)
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem
```

### **2. Construcción y Despliegue**

```bash
# Construir y iniciar servicios
docker-compose -f docker-compose.yml --env-file .env.production up -d

# Verificar estado de servicios
docker-compose ps

# Ver logs
docker-compose logs -f gamifier-api
```

### **3. Inicialización de Base de Datos**

```bash
# Ejecutar migraciones
docker-compose exec gamifier-api npx prisma migrate deploy

# Generar cliente Prisma (si es necesario)
docker-compose exec gamifier-api npx prisma generate

# Seed inicial (opcional)
docker-compose exec gamifier-api npm run seed
```

## 📊 **Monitoreo y Logs**

### **Health Checks**

```bash
# Verificar API
curl https://api.gamifier.com/health

# Verificar base de datos
docker-compose exec postgres pg_isready

# Verificar Redis
docker-compose exec redis redis-cli ping
```

### **Logs Centralizados**

```bash
# Logs de la API
docker-compose logs -f gamifier-api

# Logs de la base de datos
docker-compose logs -f postgres

# Logs de Nginx
docker-compose logs -f nginx
```

## 🔒 **Seguridad en Producción**

### **1. Configuración de Firewall**

```bash
# Permitir solo puertos necesarios
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

### **2. Backup de Base de Datos**

```bash
# Script de backup automático
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec postgres pg_dump -U gamifier gamifier > backups/backup_$DATE.sql
find backups/ -name "backup_*.sql" -mtime +7 -delete
```

### **3. Certificados SSL (Let's Encrypt)**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d api.gamifier.com

# Renovación automática
sudo crontab -e
# Añadir: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔄 **CI/CD Pipeline (GitHub Actions)**

### **.github/workflows/deploy.yml**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.PRIVATE_KEY }}
          script: |
            cd /path/to/gamifier
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker-compose exec gamifier-api npx prisma migrate deploy
```

## 📈 **Escalabilidad**

### **Escalado Horizontal**

```yaml
# docker-compose.scale.yml
services:
  gamifier-api:
    scale: 3  # Múltiples instancias
    
  nginx:
    # Configurar load balancing para múltiples instancias
```

### **Optimizaciones de Performance**

```typescript
// src/main.ts - Configuraciones de producción
app.use(compression());
app.use(helmet());
app.setGlobalPrefix('api/v1');
```

## 🆘 **Troubleshooting**

### **Problemas Comunes**

1. **API no responde**
   ```bash
   docker-compose logs gamifier-api
   docker-compose restart gamifier-api
   ```

2. **Error de conexión a base de datos**
   ```bash
   docker-compose exec postgres psql -U gamifier -d gamifier
   ```

3. **Problema de permisos**
   ```bash
   docker-compose down
   docker volume prune
   docker-compose up -d
   ```

## 📞 **Soporte**

Para soporte técnico o reportar problemas:
- **Issues**: GitHub Issues del repositorio
- **Documentación**: `http://localhost:3002/api`
- **Logs**: Verificar logs de contenedores

---

*Guía de despliegue actualizada - Mayo 2025* 