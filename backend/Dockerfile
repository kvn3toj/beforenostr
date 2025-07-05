# =================================================================
# CoomÜnity Backend - DECRETO FINAL v13 (Build Tools Fix)
# =================================================================

# -----------------
# ETAPA 1: BUILDER
# -----------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1. Herramientas base
RUN apk add --no-cache python3 make g++

# 2. Copia manifiestos y configuraciones BASE
COPY package*.json ./
COPY backend/package.json ./backend/

# 3. Copia archivos de Prisma a backend/prisma
COPY backend/prisma ./backend/prisma/

# 4. Instala dependencias BASE (sin ejecutar scripts)
RUN npm ci --ignore-scripts --legacy-peer-deps

# 5. Copia configuraciones de TypeScript
COPY backend/nest-cli.json ./backend/
COPY backend/tsconfig*.json ./backend/

# 6. Copia código fuente
COPY backend/src/. ./backend/src/

# 7. Genera cliente Prisma y construye
WORKDIR /usr/src/app/backend
RUN npx prisma generate
RUN npm run build

# -----------------
# ETAPA 2: PRODUCTION
# -----------------
FROM node:20-alpine

WORKDIR /usr/src/app

# 1. Instala herramientas de compilación
RUN apk add --no-cache python3 make g++ && \
    npm install -g node-gyp

# 2. Copia manifiestos completos
COPY package*.json ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/

# 3. Copia Prisma schema y migrations
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma

# 4. Instala dependencias de PRODUCCIÓN
RUN npm install --omit=dev --legacy-peer-deps

# 5. Copia artefactos compilados
COPY --from=builder /usr/src/app/backend/dist ./dist

# Expone el puerto
EXPOSE 3002

# Comando final con Prisma migrate
CMD ["sh", "-c", "npx prisma migrate deploy && cd backend && npm run db:seed && cd .. && node dist/main.js"]
