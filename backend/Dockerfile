# ================================================================
# CoomÜnity Backend NestJS - Multi-stage Dockerfile
# Optimizado para producción con build separado
# ================================================================

# ================================================================
# Etapa 1: Builder - Construir la aplicación
# ================================================================
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm install --legacy-peer-deps

# Copiar todo el código fuente del backend
COPY . ./

# Generar Prisma Client (importante para engines correctos)
RUN npx prisma generate

# Compilar la aplicación TypeScript a JavaScript
RUN npm run build

# Copiar Prisma Client generado a la carpeta de salida de build
RUN cp -r src/generated dist/generated

# ================================================================
# Etapa 2: Production - Crear la imagen final y ligera
# ================================================================
FROM node:20-slim AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma

# Instalar SOLO las dependencias de producción
RUN npm install --only=production --legacy-peer-deps && npm cache clean --force

# Copiar aplicación compilada y Prisma Client desde builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Exponer el puerto
EXPOSE 3002

# Iniciar la aplicación después de ejecutar las migraciones
CMD ["npm", "run", "start:prod:migrate"]

# Trigger re-deploy v3
