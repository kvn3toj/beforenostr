# ================================================================
# CoomÜnity Backend NestJS - Multi-stage Dockerfile CORREGIDO
# Optimizado para producción con build separado
# ================================================================

# ================================================================
# Etapa 1: Builder - Construir la aplicación (usando lockfile raíz)
# ================================================================
FROM node:lts-alpine AS builder

WORKDIR /usr/src/app

# Copia solo los archivos de dependencias
COPY package.json package-lock.json* ./

# Instala dependencias
RUN npm ci --legacy-peer-deps

# Copia el resto del código fuente del backend
COPY . .

# Genera Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Compila la app
RUN npm run build

# ================================================================
# Etapa 2: Producción
# ================================================================
FROM node:lts-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && npm run db:seed && node dist/main.js"]
