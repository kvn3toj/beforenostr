# ================================================================
# CoomÜnity Backend NestJS - Multi-stage Dockerfile
# Optimizado para producción con build separado
# ================================================================

# ================================================================
# Etapa 1: Builder - Construir la aplicación
# ================================================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build) y OpenSSL 1.1 para Prisma
RUN apk add --no-cache openssl1.1-compat && npm install --legacy-peer-deps

# Copiar todo el código fuente del backend
COPY . ./

# Generar el cliente de Prisma ANTES de compilar
RUN npx prisma generate

# Compilar la aplicación TypeScript a JavaScript
RUN npm run build

# ================================================================
# Etapa 2: Production - Crear la imagen final y ligera
# ================================================================
FROM node:20-alpine AS production

# Argumento para el usuario de la aplicación
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Copiar el esquema de Prisma ANTES de instalar para que `postinstall` funcione
COPY --from=builder /usr/src/app/prisma ./prisma

# Instalar SOLO las dependencias de producción
RUN apk add --no-cache openssl1.1-compat && npm install --only=production --legacy-peer-deps && npm cache clean --force

# Copiar aplicación compilada desde la etapa de builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Exponer el puerto
EXPOSE 3002

# Iniciar la aplicación después de ejecutar las migraciones
CMD ["npm", "run", "start:prod:migrate"]

# Trigger re-deploy v2
