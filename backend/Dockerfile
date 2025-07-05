# =================================================================
# CoomÜnity Backend - DECRETO FINAL v13 (Build Tools Fix)
# =================================================================

# ----------------------------------------------------------------
# Etapa 1: Builder - Instala TODAS las dependencias y construye la app
# ----------------------------------------------------------------
FROM node:20-slim AS builder

# 1. Instalar dependencias de sistema operativo para compilación
RUN apt-get update && apt-get install -y openssl python3 make g++

# 2. Establecer el directorio de trabajo principal
WORKDIR /usr/src/app

# 3. Copiar TODOS los archivos de definición de paquetes y el lockfile
COPY package*.json ./

# 4. Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm install --legacy-peer-deps

# 5. Copiar el resto del código fuente
COPY . .

# 6. Generar el cliente Prisma
RUN npx prisma generate

# 7. Construir la aplicación
RUN npm run build --workspace=backend

# ----------------------------------------------------------------
# Etapa 2: Producción - Crea una imagen final ligera y segura
# ----------------------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# 1. Instalar solo las dependencias de sistema operativo necesarias para producción
RUN apk add --no-cache openssl3

# 2. Copiar el package.json de la raíz y el del backend
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# 3. ¡CRÍTICO! Copiar el schema de Prisma ANTES de npm install
COPY --from=builder /usr/src/app/backend/prisma ./prisma

# 4. Instalar ÚNICAMENTE las dependencias de PRODUCCIÓN
RUN npm install --omit=dev --legacy-peer-deps

# 5. Copiar el código compilado
COPY --from=builder /usr/src/app/backend/dist ./dist

# 6. Exponer el puerto
EXPOSE 3002

# 7. Comando de inicio
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
