# ================================================================
# CoomÜnity Gamifier Admin Frontend - Multi-stage Dockerfile
# Optimizado para producción con Nginx
# ================================================================

# ================================================================
# Etapa 1: Builder - Preparación y compilación
# ================================================================
FROM node:18-alpine AS builder

# Metadatos del contenedor
LABEL maintainer="CoomÜnity Team"
LABEL version="1.0.0"
LABEL description="CoomÜnity Gamifier Admin - Builder Stage"

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias con legacy-peer-deps para MUI v7
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copiar código fuente
COPY . .

# Variables de entorno para build de producción
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=http://localhost:3002
ENV VITE_APP_ENV=production

# Construir aplicación
RUN npm run build

# ================================================================
# Etapa 2: Producción - Servidor Nginx optimizado
# ================================================================
FROM nginx:alpine AS production

# Metadatos del contenedor
LABEL maintainer="CoomÜnity Team"
LABEL version="1.0.0"
LABEL description="CoomÜnity Gamifier Admin - Production"

# Instalar curl para health checks
RUN apk add --no-cache curl

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S coomunity && \
    adduser -S coomunity -u 1001

# Copiar archivos construidos desde builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx para SPA
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html index.htm;

    # Configuración para Single Page Application
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Configuración de archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Configuración de compresión
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate max-age=0;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Cambiar permisos al usuario no-root
RUN chown -R coomunity:coomunity /usr/share/nginx/html && \
    chown -R coomunity:coomunity /var/cache/nginx && \
    chown -R coomunity:coomunity /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R coomunity:coomunity /var/run/nginx.pid

# Cambiar a usuario no-root
USER coomunity

# Exponer puerto
EXPOSE 80

# Variables de entorno
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"] 