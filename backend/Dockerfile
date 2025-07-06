# =================================================================
# CoomÜnity Backend - DECRETO FINAL v16 (Monorepo Context Fix)
# =================================================================

# === STAGE 1: Builder ===
FROM node:20-slim as builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY backend/package.json ./backend/package.json
COPY prisma ./prisma/
COPY backend/prisma ./backend/prisma/
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate --schema=backend/prisma/schema.prisma
RUN npm run build --workspace=backend

# === STAGE 2: Production ===
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/package.json ./backend/package.json
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules
COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/backend/prisma ./backend/prisma
COPY backend/start-production.sh .
RUN chmod +x ./start-production.sh
CMD ["./start-production.sh"]
