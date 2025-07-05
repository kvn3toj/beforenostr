# =================================================================
# CoomÜnity Backend - Dockerfile v4 (Control Explícito de Prisma)
# =================================================================

# Etapa 1: Builder
FROM node:20-alpine AS builder

# 1. Herramientas base
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# 2. Copia manifiestos y schema
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY prisma/. ./prisma/

# 3. Instala dependencias SIN ejecutar scripts automáticos
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts

# 4. Copia el código fuente
COPY backend/. ./backend/

# 5. AHORA, ejecuta Prisma Generate manualmente con la ruta explícita
RUN npx prisma generate --schema=./prisma/schema.prisma

# 6. Build del backend
RUN npm run build --workspace=backend

# ================================================================
# Etapa 2: Producción
# ================================================================
FROM node:lts-alpine

WORKDIR /usr/src/app

# Copia solo los artefactos necesarios desde el builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && npm run db:seed --workspace=backend && node dist/main.js"]
