# 📚 DOCUMENTACIÓN COSMOLÓGICA DE DOCKER + PRISMA + ENV + DEPLOY (COOMÜNITY BACKEND)

---

## 1. Dockerfile: Patrones, Trampas y Soluciones

### 1.1. Estructura Canónica de Build Multi-Etapa

- **Etapa 1: Builder**
  - Instala todas las dependencias (incluyendo dev).
  - Genera el cliente Prisma:
    ```dockerfile
    RUN npx prisma generate --schema=backend/prisma/schema.prisma
    ```
  - Compila el backend:
    ```dockerfile
    RUN npm run build --workspace=backend
    ```
- **Etapa 2: Producción**
  - Usa `node:20-alpine`.
  - Instala solo dependencias mínimas (`openssl3`).
  - Copia solo lo necesario: `package.json`, `dist`, `prisma`, y el cliente Prisma generado:
    ```dockerfile
    COPY --from=builder /usr/src/app/backend/src/generated/prisma ./backend/src/generated/prisma
    ```
  - Instala solo dependencias de producción:
    ```dockerfile
    RUN npm install --omit=dev --legacy-peer-deps --ignore-scripts
    ```
  - Expone el puerto y define el comando de arranque:
    ```dockerfile
    EXPOSE 3002
    CMD ["sh", "-c", "npx prisma migrate deploy --schema=backend/prisma/schema.prisma && node backend/dist/main.js"]
    ```

### 1.2. Trampas y Soluciones

- **MODULE_NOT_FOUND de Prisma:** Copiar explícitamente el cliente Prisma generado a la imagen final.
- **Prisma Query Engine incorrecto:** Agregar el target correcto en `binaryTargets` (ver sección 2).
- **Variables de entorno no encontradas:** Pasar todas las necesarias con `-e` en `docker run` o definirlas en Docker Compose.

---

## 2. Prisma: binaryTargets y Compatibilidad de Arquitectura

### 2.1. El Problema

- Prisma necesita binarios específicos para la arquitectura y sistema operativo del contenedor final.
- Alpine ARM64 requiere: `"linux-musl-arm64-openssl-3.0.x"`

### 2.2. Solución Canónica

En `backend/prisma/schema.prisma`:

```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "../src/generated/prisma"
  binaryTargets = ["native", "debian-openssl-3.0.x", "linux-musl-arm64-openssl-3.0.x"]
}
```

- `"native"`: para desarrollo local.
- `"debian-openssl-3.0.x"`: para builds x86_64.
- `"linux-musl-arm64-openssl-3.0.x"`: para Alpine ARM64 (producción).

> **Referencia:** [Prisma Docs: binaryTargets](https://www.prisma.io/docs/orm/prisma-schema/overview/generators#binarytargets)

---

## 3. Packages y Monorepo: Reglas de Orquestación

- Instalar dependencias desde la raíz del monorepo.
- Usar `--legacy-peer-deps` para resolver conflictos (MUI v7, React 18+).
- No instalar Playwright ni dependencias de test en producción.
- Mantener un solo `package-lock.json` en la raíz.

---

## 4. .env y Variables de Entorno: Patrones y Seguridad

### 4.1. Variables Críticas para Backend

- `NODE_ENV=production`
- `DATABASE_URL=...` (usar siempre la URL externa para producción)
- `JWT_SECRET=...`
- `REDIS_URL=...`
- `ALLOWED_ORIGINS=...`
- `LOG_LEVEL=info`

### 4.2. Patrones de Uso

- Nunca hardcodear valores en el código.
- No leer `.env` directamente en Docker: pasar variables con `-e` en `docker run` o usar Docker Compose.
- No exponer secretos en logs ni en imágenes públicas.
- Verificar que la base de datos acepte conexiones externas.

---

## 5. Comando Docker de Producción: Patrón Canónico

```bash
docker run --rm -it \
  -p 3002:3002 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<db>" \
  -e JWT_SECRET="..." \
  -e REDIS_URL="..." \
  -e ALLOWED_ORIGINS="..." \
  -e LOG_LEVEL=info \
  coomunity-backend-test
```

- Reemplazar `<user>`, `<password>`, `<host>`, `<db>` por los valores reales de producción.
- No usar variables de entorno con nombres incorrectos (`DATABASE_SiURL` es un typo, debe ser `DATABASE_URL`).

---

## 6. Deploy y Debugging: Checklist de Éxito

- Verificar que el cliente Prisma esté en la ruta esperada (`src/generated/prisma`).
- Verificar que el Query Engine correcto esté presente.
- Verificar que la base de datos acepte conexiones externas.
- Verificar que Redis esté accesible desde el contenedor.
- Verificar que las migraciones de Prisma se apliquen correctamente.
- Verificar que el backend exponga el puerto 3002 y responde a `/health`.

---

## 7. Errores Comunes y Soluciones

| Error                                                   | Causa                                          | Solución                                               |
| ------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| `MODULE_NOT_FOUND: .../generated/prisma`                | Cliente Prisma no copiado a la imagen final    | Agregar `COPY` explícito en Dockerfile                 |
| `PrismaClientInitializationError: ... Query Engine ...` | Falta el binario correcto para la arquitectura | Agregar target correcto en `binaryTargets` y regenerar |
| `Error: Environment variable not found: DATABASE_URL`   | Variable no pasada al contenedor               | Pasar con `-e` en `docker run` o Docker Compose        |
| `Can't reach database server`                           | DB no acepta conexiones externas o firewall    | Usar URL externa y verificar reglas de red             |
| `JWT_SECRET not set`                                    | Variable faltante                              | Pasar con `-e`                                         |

---

## 8. Referencias y Recursos

- [Prisma Docs: binaryTargets](https://www.prisma.io/docs/orm/prisma-schema/overview/generators#binarytargets)
- [Prisma Docs: Deploy with Docker](https://www.prisma.io/docs/guides/deployment/deploy-database-with-docker)
- [DevOps.dev: Connect Docker Containers with External Databases](https://blog.devops.dev/how-to-connect-docker-containers-with-external-databases-868123770c1a?gi=e6b26fe91bcf)
- [Docker Docs: Environment Variables](https://docs.docker.com/compose/how-tos/environment-variables/)
- [Docker Docs: COPY Instruction](https://www.docker.com/blog/docker-best-practices-understanding-the-differences-between-add-and-copy-instructions-in-dockerfiles/)

---

## 9. Filosofía CoomÜnity Aplicada

- Transparencia y reproducibilidad: Cada build y deploy debe ser 100% reproducible y documentado.
- Bien común: Documentar y compartir estos aprendizajes evita reprocesos y eleva la calidad colectiva.
- Ayni: Cada error resuelto y documentado es un acto de reciprocidad para futuros guardianes.

---

# RESUMEN EJECUTIVO

- **Dockerfile**: Multi-etapa, copia explícita del cliente Prisma, build robusto.
- **Prisma**: `binaryTargets` alineados a la arquitectura de producción.
- **Packages**: Orquestación desde la raíz, dependencias limpias.
- **.env**: Variables críticas siempre pasadas por entorno, nunca hardcodeadas.
- **Deploy**: Checklist de éxito, comando canónico, debugging sistemático.
- **Documentación**: Todo aprendizaje queda registrado para la comunidad.
