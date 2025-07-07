# =================================================================
# CoomÜnity Backend - Production Dockerfile (Optimized by ATLAS)
# =================================================================

# === STAGE 1: Builder ===
# Usa una imagen base con herramientas de construcción
FROM node:20-slim as builder

# Instala dependencias del sistema operativo para Prisma y otros paquetes
RUN apt-get update && apt-get install -y openssl python3 make g++

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de manifiesto y bloqueo para instalar dependencias
COPY package*.json ./
COPY turbo.json ./
COPY backend/package.json ./backend/package.json

# Copia el esquema Y las migraciones de Prisma ANTES de instalar
# para asegurar que `prisma generate` funcione correctamente
COPY backend/prisma ./backend/prisma

# Instala todas las dependencias (incluyendo las de desarrollo para el build)
RUN npm install --legacy-peer-deps --ignore-scripts

# Copia el resto del código fuente del backend
COPY backend ./backend

# Instala NestJS CLI (necesario para el build)
RUN npm install -g @nestjs/cli

# Construye la aplicación del backend
RUN npm run build --workspace=backend

# === STAGE 2: Production ===
# Usa una imagen alpina, más ligera y segura para producción
FROM node:20-alpine

# Instala solo las dependencias de sistema operativo necesarias para correr la app
RUN apk add --no-cache openssl3 netcat-openbsd bash

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de manifiesto para instalar SOLO dependencias de producción
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/turbo.json ./
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# Instala SOLO las dependencias de producción
RUN npm install --omit=dev --legacy-peer-deps --ignore-scripts

# Copia la aplicación ya compilada desde la etapa de 'builder'
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# ----------------- INICIO DE LA CORRECCIÓN DE ATLAS -----------------
# Copia el esquema de Prisma Y el directorio completo de migraciones.
# Esta es la corrección clave para asegurar que las nuevas migraciones
# siempre estén presentes en la imagen de producción.
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma
# ------------------ FIN DE LA CORRECCIÓN DE ATLAS -------------------

# Copia los scripts de inicio y les da permisos de ejecución
COPY backend/start-production.sh ./start-production.sh
RUN chmod +x ./start-production.sh

COPY backend/force-migrations.sh ./force-migrations.sh
RUN chmod +x ./force-migrations.sh

# 🦅 PHOENIX: Copia el script de limpieza de migraciones
COPY backend/phoenix-migration-cleanup.sh ./phoenix-migration-cleanup.sh
RUN chmod +x ./phoenix-migration-cleanup.sh

# Expone el puerto que la aplicación usará
EXPOSE 3002

# Define el comando para iniciar la aplicación
CMD ["./start-production.sh"]

# ATLAS MISSION: Forzar nuevo build con migración 20250707005901_add_missing_unique_constraints
# Timestamp: Jul 6 20:45:00 2025 - Migración creada después del último build exitoso
# 🦅 PHOENIX MISSION: Renacimiento del esquema con migración inicial única
# Timestamp: Jul 6 22:30:58 2025 - Migración inicial limpia (20250707033058_init)
