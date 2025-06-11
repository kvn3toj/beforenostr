# 🐳 CoomÜnity SuperApp - Multi-stage Dockerfile
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

# Construir aplicación
RUN npm run build:prod

# ================================================================
# Production Stage - Servidor optimizado para producción
# ================================================================
FROM nginx:alpine AS production

# Instalar Node.js para servir la aplicación (opcional, si necesitas SSR)
RUN apk add --no-cache nodejs npm

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Cambiar permisos
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Crear directorio para PID de nginx
RUN touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

# Exponer puerto
EXPOSE 3000

# Cambiar a usuario no-root
USER nextjs

# Variables de entorno para producción
ENV NODE_ENV=production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]

# ================================================================
# Metadata
# ================================================================
LABEL maintainer="CoomÜnity Team"
LABEL version="1.0.0"
LABEL description="CoomÜnity SuperApp - Aplicación Frontend Reactiva" 