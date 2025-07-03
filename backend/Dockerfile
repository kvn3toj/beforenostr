# ================================================================
# CoomÜnity Backend NestJS - Multi-stage Dockerfile
# Optimizado para producción con build separado
# ================================================================

# ================================================================
# Etapa 1: Builder - Construir la aplicación
# ================================================================
FROM node:lts-alpine AS builder

WORKDIR /app

# Instala dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copia el resto del código fuente
COPY . .

# Genera Prisma Client para Linux dentro del contenedor
RUN npx prisma generate --schema=./prisma/schema.prisma

# Compila la app (NestJS)
RUN npm run build

# Etapa 2: Producción
FROM node:lts-alpine AS production

WORKDIR /app

# Copia solo lo necesario desde la etapa de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production

# Railway inyecta DATABASE_URL y otras variables automáticamente
CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed && node dist/main.js"]

# Trigger re-deploy v3
