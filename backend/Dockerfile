# =================================================================
# CoomÜnity Backend - DECRETO FINAL v13 (Build Tools Fix)
# =================================================================

# ----------------------------------------------------------------
# Etapa 1: Builder - Construye la aplicación en un entorno completo
# ----------------------------------------------------------------
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY backend/. ./backend/

RUN npm install --legacy-peer-deps

RUN npx prisma generate --schema=backend/prisma/schema.prisma

RUN npm run build --workspace=backend

# ----------------------------------------------------------------
# Etapa 2: Producción - Imagen final ligera y segura
# ----------------------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

RUN apk add --no-cache openssl3

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# ¡CRÍTICO! Copiar el schema de Prisma ANTES de npm install
COPY --from=builder /usr/src/app/backend/prisma ./prisma

RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /usr/src/app/backend/dist ./dist

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
