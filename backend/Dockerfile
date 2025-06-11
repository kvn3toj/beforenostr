# ================================================================
# CoomÜnity Backend NestJS - Multi-stage Dockerfile
# Optimizado para producción con build separado
# ================================================================

# ================================================================
# Etapa 1: Builder - Preparación y compilación
# ================================================================
FROM node:18-alpine AS builder

# Metadatos del contenedor
LABEL maintainer="CoomÜnity Team"
LABEL version="1.0.0"
LABEL description="CoomÜnity Backend NestJS - Builder Stage"

# Instalar dependencias del sistema necesarias para build
RUN apk add --no-cache python3 make g++ openssl

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci --only=production=false && npm cache clean --force

# Copiar código fuente
COPY src/ ./src/
COPY prisma/ ./prisma/

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar la aplicación TypeScript
RUN npm run build

# ================================================================
# Etapa 2: Producción - Imagen optimizada final
# ================================================================
FROM node:18-alpine AS production

# Metadatos del contenedor
LABEL maintainer="CoomÜnity Team"
LABEL version="1.0.0"
LABEL description="CoomÜnity Backend NestJS - Production"

# Instalar dependencias mínimas del sistema
RUN apk add --no-cache openssl curl

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S coomunity && \
    adduser -S coomunity -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar aplicación compilada desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Cambiar propietario de archivos al usuario no-root
RUN chown -R coomunity:coomunity /app
USER coomunity

# Exponer puerto de la aplicación
EXPOSE 3002

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

# Comando de inicio
CMD ["node", "dist/main.js"] 