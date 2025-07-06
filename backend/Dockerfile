# =================================================================
# CoomÜnity Backend - DECRETO FINAL v16 (Monorepo Context Fix)
# =================================================================

# ----------------------------------------------------------------
# Etapa 1: Builder - Instala TODAS las dependencias y construye la app
# ----------------------------------------------------------------
FROM node:20-slim AS builder

# 1. Instalar dependencias de sistema operativo para compilación
RUN apt-get update && apt-get install -y openssl python3 make g++

# 2. Establecer el directorio de trabajo principal (raíz del monorepo)
WORKDIR /usr/src/app

# 3. Copiar archivos clave del monorepo desde el contexto raíz
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# 4. Copiar el directorio backend completo
COPY backend ./backend

# 5. Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm install --legacy-peer-deps --ignore-scripts

# 6. Instalar NestJS CLI globalmente (necesario para el build)
RUN npm install -g @nestjs/cli

# 7. Generar el cliente Prisma (desde backend)
RUN npx prisma generate --schema=backend/prisma/schema.prisma

# 8. Construir la aplicación backend usando workspace
RUN npm run build --workspace=backend

# ----------------------------------------------------------------
# Etapa 2: Producción - Crea una imagen final ligera y segura
# ----------------------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# 1. Instalar herramientas necesarias para producción y diagnóstico
RUN apk add --no-cache openssl3 netcat-openbsd bash

# 2. Copiar archivos clave del monorepo
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/turbo.json ./
COPY --from=builder /usr/src/app/tsconfig.json ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# 3. Copiar el schema de Prisma ANTES de npm install
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# 4. Instalar ÚNICAMENTE las dependencias de PRODUCCIÓN
RUN npm install --omit=dev --legacy-peer-deps --ignore-scripts

# 5. Copiar el código compilado
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# 5.1 Copiar el cliente Prisma generado (output personalizado)
COPY --from=builder /usr/src/app/backend/src/generated/prisma ./backend/src/generated/prisma

# 6. Copiar el script de inicio optimizado desde el contexto raíz
COPY backend/start-production.sh ./start-production.sh
RUN chmod +x ./start-production.sh

# 7. Exponer el puerto
EXPOSE 3002

# 8. Comando de inicio usando el script optimizado
CMD ["./start-production.sh"]
