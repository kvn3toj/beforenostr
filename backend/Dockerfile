# ================================================================
# CoomÜnity Backend NestJS - Multi-stage Dockerfile CORREGIDO
# Optimizado para producción con build separado
# ================================================================

# ================================================================
# Etapa 1: Builder - Construir la aplicación
# ================================================================
FROM node:lts-alpine AS builder

WORKDIR /app

# Instala dependencias del sistema necesarias para Prisma
RUN apk add --no-cache openssl

# Copia archivos de configuración (rutas simples para contexto backend/)
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Instala todas las dependencias (incluyendo dev para build)
RUN npm ci --legacy-peer-deps

# Copia el resto del código fuente
COPY . .

# Genera Prisma Client para Linux dentro del contenedor
RUN npx prisma generate --schema=./prisma/schema.prisma

# Compila la app (NestJS)
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
