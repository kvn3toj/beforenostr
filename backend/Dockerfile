# =================================================================
# CoomÜnity Backend - DECRETO DEFINITIVO DE CONSTRUCCIÓN
# =================================================================

# -----------------
# ETAPA 1: BUILDER
# Un taller con TODAS las herramientas para construir la aplicación.
# -----------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1. Instala Python3 y herramientas de build necesarias para node-gyp
RUN apk add --no-cache python3 make g++

# 2. Copia manifiestos y schema primero
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY prisma/. ./prisma/

# Verificación temporal
RUN ls -l ./prisma && cat ./prisma/schema.prisma

# 3. Instala TODAS las dependencias, incluyendo las de desarrollo.
#    Esto asegura que `prisma` CLI esté disponible.
RUN npm install --legacy-peer-deps

# 4. Copia TODO el código fuente.
COPY backend/src/. ./backend/src/

# 5. Construye la aplicación. Esto compilará el TypeScript a JavaScript.
RUN npm run build --workspace=backend


# -----------------
# ETAPA 2: PRODUCTION
# El templo final, puro y optimizado, solo con lo esencial.
# -----------------
FROM node:lts-alpine

WORKDIR /usr/src/app

# 1. Copia los manifiestos de dependencias.
COPY package.json ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# 2. Instala ÚNICAMENTE las dependencias de PRODUCCIÓN.
#    Esto crea un `node_modules` limpio y ligero.
RUN npm ci --omit=dev --legacy-peer-deps

# 3. Copia el código ya compilado y los artefactos de Prisma desde el Builder.
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Expone el puerto
EXPOSE 3002

# Comando final para migrar, sembrar y ejecutar la aplicación compilada.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed --workspace=backend && node dist/main.js"]
