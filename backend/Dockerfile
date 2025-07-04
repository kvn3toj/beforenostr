# ================================================================
# CoomÜnity Backend NestJS - Multi-stage Dockerfile CORREGIDO
# Optimizado para producción con build separado
# ================================================================

# ================================================================
# Etapa 1: Builder - Construir la aplicación (usando lockfile raíz)
# ================================================================
FROM node:lts-alpine AS builder

WORKDIR /usr/src/app

# Copia los archivos de definición de paquetes de la raíz y del backend
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/

# Instala dependencias del monorepo
RUN npm ci --legacy-peer-deps

# Copia el código fuente del backend y el schema de Prisma
COPY backend/. ./backend/
COPY prisma/. ./prisma/

# Genera el cliente de Prisma
RUN cd backend && npx prisma generate --schema=../prisma/schema.prisma

# Build del backend
RUN npm run build --workspace=backend

# ================================================================
# Etapa 2: Producción
# ================================================================
FROM node:lts-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json ./
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed --workspace=backend && node dist/main.js"]
