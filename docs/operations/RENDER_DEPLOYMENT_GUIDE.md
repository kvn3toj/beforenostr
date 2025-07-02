# Guía de Despliegue y Mantenimiento en Render para CoomÜnity Backend

Este documento proporciona las instrucciones definitivas para desplegar y mantener el backend de CoomÜnity en la plataforma Render, con un enfoque especial en la resolución de problemas críticos de migración de base de datos que hemos enfrentado.

## 1. Configuración de Despliegue del Servicio Web

Al crear o configurar el servicio del backend en Render, utiliza los siguientes parámetros:

| Parámetro       | Valor                                        | Notas                                                              |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| **Language**    | `Node`                                       | Render detectará el entorno de Node.js.                            |
| **Build Command** | `npm install && npm run build`               | Instala dependencias y compila el proyecto TypeScript.             |
| **Start Command** | `npm run start:prod`                         | Ejecuta el script de inicio para producción definido `package.json`. |

### Variables de Entorno Esenciales

Asegúrate de que las siguientes variables de entorno estén configuradas en el panel de Render:

-   `DATABASE_URL`: La **URL de conexión interna** proporcionada por la base de datos de PostgreSQL en Render. Es crucial para la comunicación entre servicios dentro de la red de Render.
-   `SECRET_KEY_BASE`: Una clave secreta robusta para la seguridad de la aplicación (p. ej., para JWT).
-   Otras variables específicas de la aplicación (`REDIS_URL`, claves de API, etc.).

## 2. Resolución de Errores Críticos de Migración de Prisma

Este es el procedimiento de emergencia para cuando un despliegue falla debido a un error de migración de Prisma (como `P3009` o `current transaction is aborted`). Este error ocurre cuando una migración se queda en un estado inconsistente en la base de datos.

### Paso 1: Obtener la URL de Conexión Externa

La resolución manual requiere conectarse a la base de datos desde tu máquina local. Para ello, necesitas la **URL de Conexión Externa**.

1.  Ve al **Dashboard de Render**.
2.  Selecciona tu servicio de base de datos PostgreSQL.
3.  En la sección "Info" o "Connect", busca la credencial llamada `External Connection URL` o `External Database URL`.
4.  Copia esta URL. La necesitarás para el siguiente paso.

### Paso 2: Identificar la Migración Fallida

En los logs de despliegue de Render, localiza el mensaje de error de Prisma. El log te indicará el nombre exacto de la migración que está fallando. Por ejemplo:

```
Applying migration `20250701114754_add_customer_journey_stages`
Error: ERROR: current transaction is aborted...
```

El identificador que necesitas es `20250701114754_add_customer_journey_stages`.

### Paso 3: Ejecutar el Comando de Resolución Manual

Abre una terminal en tu máquina local, en la raíz del monorepo, y ejecuta el siguiente comando, reemplazando los valores correspondientes:

```bash
DATABASE_URL="[TU_URL_DE_CONEXION_EXTERNA]" npm exec --workspace=backend -- npx prisma migrate resolve --applied [ID_DE_LA_MIGRACION_FALLIDA]
```

**Ejemplo Real:**

```bash
DATABASE_URL="postgresql://coomunity_db_prod_user:xxxx@dpg-xxx.oregon-postgres.render.com/coomunity_db_prod" npm exec --workspace=backend -- npx prisma migrate resolve --applied 20250701114754_add_customer_journey_stages
```

Este comando le indica a Prisma que marque la migración específica como "aplicada" sin intentar ejecutarla de nuevo, resolviendo el estado de bloqueo.

### Paso 4: Re-desplegar en Render

Una vez que el comando anterior se haya completado con éxito, ve al panel de Render y **lanza un nuevo despliegue manual** (`Deploy latest commit`). El pipeline de despliegue ahora debería pasar la fase de migración y poner en línea el servidor.

---

## Filosofía CoomÜnity Aplicada

Este proceso encarna nuestros principios de **resiliencia (Fuego)** y **aprendizaje sistémico (Agua)**. En lugar de simplemente revertir, analizamos el problema, encontramos una solución precisa y documentamos el aprendizaje para fortalecer nuestro sistema y conocimiento colectivo. Cada desafío resuelto hace que nuestra plataforma y nuestro equipo sean más robustos. 
