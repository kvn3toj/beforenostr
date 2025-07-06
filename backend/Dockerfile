# =================================================================
# CoomÜnity Backend - Production Dockerfile (Optimized)
# =================================================================

# === STAGE 1: Builder ===
FROM node:20-slim as builder

# Install system dependencies
RUN apt-get update && apt-get install -y openssl python3 make g++

# Set working directory
WORKDIR /usr/src/app

# Copy package files from monorepo root
COPY package*.json ./
COPY turbo.json ./

# Copy backend-specific package.json
COPY backend/package.json ./backend/package.json

# Copy Prisma schema
COPY backend/prisma ./backend/prisma

# Install dependencies
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy backend source code
COPY backend ./backend

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Build the application
RUN npm run build --workspace=backend

# === STAGE 2: Production ===
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache openssl3 netcat-openbsd bash

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/turbo.json ./

# Copy backend package.json
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json

# Copy built application
COPY --from=builder /usr/src/app/backend/dist ./backend/dist

# Copy Prisma schema and generated client
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma
COPY --from=builder /usr/src/app/backend/src/generated/prisma ./backend/src/generated/prisma

# Install production dependencies
RUN npm install --omit=dev --legacy-peer-deps --ignore-scripts

# Copy startup script
COPY backend/start-production.sh ./start-production.sh
RUN chmod +x ./start-production.sh

# Expose port
EXPOSE 3002

# Start the application
CMD ["./start-production.sh"]
