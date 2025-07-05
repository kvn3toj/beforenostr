# =================================================================
# CoomÜnity Backend - DECRETO FINAL DE CONSTRUCCIÓN v7 (CONTROL EXPLÍCITO PRISMA)
# =================================================================

# -----------------
# ETAPA 1: BUILDER
# Un taller con TODAS las herramientas, bajo control explícito.
# -----------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1. Herramientas base.
RUN apk add --no-cache python3 make g++

# 2. Copia manifiestos y schema.
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY prisma/. ./prisma/

# 3. Instala TODAS las dependencias, pero ignora scripts automáticos.
RUN npm install --legacy-peer-deps --ignore-scripts

# 4. Copia TODO el código fuente del backend.
COPY backend/src/. ./backend/src/

# 5. ¡NUEVA DIRECTIVA! Copia los archivos de configuración del backend.
#    Son necesarios para que `nest build` funcione correctamente.
COPY backend/tsconfig.json ./backend/
COPY backend/tsconfig.build.json ./backend/
COPY backend/nest-cli.json ./backend/

# 6. Genera Prisma Client manualmente (control explícito).
RUN npx prisma generate --schema=./prisma/schema.prisma

# 7. Construye la aplicación.
RUN npm run build --workspace=backend


# -----------------
# ETAPA 2: PRODUCTION
# El templo final, puro y optimizado.
# -----------------
FROM node:lts-alpine

WORKDIR /usr/src/app

# 1. Copia manifiestos.
COPY package.json ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# 2. Instala dependencias de PRODUCCIÓN.
RUN npm ci --omit=dev --legacy-peer-deps

# 3. Copia artefactos compilados desde el Builder.
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Expone el puerto
EXPOSE 3002

# Comando final para migrar, sembrar y ejecutar.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed --workspace=backend && node dist/main.js"]
