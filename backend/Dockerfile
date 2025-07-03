# ================================================================
# CoomÜnity Backend NestJS - Multi-stage Dockerfile CORREGIDO
# Optimizado para producción con build separado
# ================================================================

# ================================================================
# Etapa 1: Builder - Construir la aplicación (usando lockfile raíz)
# ================================================================
FROM node:lts-alpine AS builder

# El contexto de build será **la raíz del monorepo** y no backend/
# Por eso, /app contendrá exclusivamente el código del backend
WORKDIR /app

# Dependencias del sistema para Prisma
RUN apk add --no-cache openssl

# ------------------------------------------------
# Paso 1 – Copiar package-lock.json raíz (monorepo)
# ------------------------------------------------
COPY package-lock.json ./

# ------------------------------------------------
# Paso 2 – Copiar el package.json del backend como principal
# (se renombra para que npm ci lo detecte)
# ------------------------------------------------
COPY backend/package.json ./package.json

# ------------------------------------------------
# Paso 3 – Copiar prisma y resto de fuentes del backend
# ------------------------------------------------
COPY backend/prisma ./prisma

# Instalación SOLO de dependencias requeridas por el backend
RUN npm ci --legacy-peer-deps

# Copiar el resto del código fuente del backend
COPY backend/. ./

# Generar Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Compilar la app (NestJS)
RUN npm run build

# ================================================================
# Etapa 2: Producción
# ================================================================
FROM node:lts-alpine AS production

WORKDIR /app

# Instala openssl para Prisma
RUN apk add --no-cache openssl

# Copia solo lo necesario desde la etapa de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3002

# Expone el puerto
EXPOSE 3002

# Comando optimizado de inicio
CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed && node dist/main.js"]
