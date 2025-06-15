# 🐳 CoomÜnity Admin Frontend - Multi-stage Dockerfile
# Optimizado para desarrollo y producción

# ================================================================
# Base Stage - Node.js con dependencias del sistema
# ================================================================
FROM node:18-alpine AS base

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    curl \
    && rm -rf /var/cache/apk/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de packages
COPY package*.json ./

# ================================================================
# Dependencies Stage - Instalar dependencias
# ================================================================
FROM base AS deps

# Instalar dependencias de producción y desarrollo con legacy-peer-deps para MUI v7
RUN npm install --legacy-peer-deps && npm cache clean --force

# ================================================================
# Development Stage - Para desarrollo local con hot reload
# ================================================================
FROM base AS development

# Copiar dependencias
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Variables de entorno para desarrollo
ENV NODE_ENV=development
ENV VITE_API_BASE_URL=http://localhost:3002
ENV VITE_APP_ENV=development

# Comando de desarrollo con hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# ================================================================
# Builder Stage - Construir aplicación para producción
# ================================================================
FROM base AS builder

# Copiar dependencias
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Variables de entorno para build
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://localhost:3002}
ENV VITE_APP_ENV=production

# Construir aplicación (usando el script específico del admin)
RUN npm run build

# ================================================================
# Production Stage - Servidor optimizado para producción
# ================================================================
FROM nginx:alpine AS production

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear configuración básica de Nginx
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://backend:3002/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Crear usuario no-root
RUN addgroup -g 1001 -S coomunity && \
    adduser -S coomunity -u 1001 -G coomunity

# Cambiar permisos
RUN chown -R coomunity:coomunity /usr/share/nginx/html && \
    chown -R coomunity:coomunity /var/cache/nginx && \
    chown -R coomunity:coomunity /var/log/nginx && \
    chown -R coomunity:coomunity /etc/nginx/conf.d

# Crear directorio para PID de nginx
RUN touch /var/run/nginx.pid && \
    chown -R coomunity:coomunity /var/run/nginx.pid

# Exponer puerto
EXPOSE 80

# Cambiar a usuario no-root
USER coomunity

# Variables de entorno para producción
ENV NODE_ENV=production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]

# ================================================================
# Metadata
# ================================================================
LABEL maintainer="CoomÜnity Team"
LABEL version="1.0.0"
LABEL description="CoomÜnity Admin Frontend - Panel de Administración" 