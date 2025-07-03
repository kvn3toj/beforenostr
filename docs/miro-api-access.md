# [HERMES] Acceso a la API de Miro — Guía de Configuración OAuth 2.0

> Referencia para la obtención y uso seguro de credenciales de Miro para la Red de Acción Sistémica CoomÜnity.

---

## 1. Prerrequisitos
- Tener un equipo de desarrollador en Miro.
- Crear una app en el portal de desarrolladores de Miro.
- Configurar la app con los permisos/scopes necesarios (ej. `boards:read`, `boards:write`, `boards:content:read`, `boards:content:write`).
- Instalar la app en el equipo/tablero correspondiente.

---

## 2. Flujo de Autenticación OAuth 2.0

### Paso 1: Solicitar autorización del usuario
- Construir el link de autorización:
  ```
  https://miro.com/oauth/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}
  ```
- Redirigir al usuario a este link para que autorice la app.

### Paso 2: Intercambiar el código de autorización por un access token
- Hacer un POST a:
  ```
  https://api.miro.com/v1/oauth/token
  ```
  Con los siguientes parámetros:
  - `grant_type=authorization_code`
  - `client_id={CLIENT_ID}`
  - `client_secret={CLIENT_SECRET}`
  - `code={AUTHORIZATION_CODE}`
  - `redirect_uri={REDIRECT_URI}`

- Ejemplo de respuesta:
  ```json
  {
    "user_id": "9876543210123456789",
    "refresh_token": "...",
    "access_token": "...",
    "expires_in": 3599,
    "team_id": "1234567890987654321",
    "scope": "boards:write boards:read",
    "token_type": "bearer"
  }
  ```

### Paso 3: Usar el access token para llamadas a la API REST de Miro
- Incluir el token en el header:
  ```http
  Authorization: Bearer {ACCESS_TOKEN}
  ```
- Ejemplo de llamada:
  ```bash
  curl --request GET \
    --url https://api.miro.com/v2/boards/{BOARD_ID} \
    --header 'Authorization: Bearer {ACCESS_TOKEN}'
  ```

### Paso 4: Refrescar el access token (opcional)
- Usar el `refresh_token` para obtener un nuevo access token cuando expire.

---

## 3. Parámetros Clave

- **API Token:** Se obtiene tras el flujo OAuth, debe almacenarse de forma segura (ej. en un gestor de secretos o variable de entorno).
- **boardId:** El identificador del tablero Miro donde se sincronizarán las tareas. Puede obtenerse desde la URL del tablero o vía API.
- **Mapeo de columnas a estados:**  
  - Definir en la configuración del motor de sincronización cómo se mapean las columnas del Kanban de Miro a los estados del `TaskDTO` (`PENDING`, `IN_PROGRESS`, `DONE`, `BLOCKED`).

---

## 4. Seguridad y Buenas Prácticas

- **Nunca** exponer el `client_secret` ni los tokens en el frontend o repositorios públicos.
- Documentar el proceso de obtención y almacenamiento de credenciales en un archivo seguro (este documento).
- Limitar los permisos de la app solo a los necesarios.
- Si se recibe un error de permisos insuficientes, revisar los scopes configurados y reautorizar la app.

---

## 5. Recursos útiles
- [Guía oficial OAuth 2.0 de Miro](https://developers.miro.com/docs/getting-started-with-oauth)
- [Referencia de API de Miro](https://developers.miro.com/reference/authorization-flow-for-expiring-access-tokens)
- [Solución de problemas OAuth2.0](https://developers.miro.com/docs/troubleshooting-oauth20)

---

## 6. Ejemplo de flujo completo

1. El usuario hace clic en "Sincronizar con Miro" y es redirigido al link de autorización.
2. Tras autorizar, Miro redirige a `{REDIRECT_URI}` con un `code` temporal.
3. El backend intercambia el `code` por un `access_token` y `refresh_token`.
4. El backend almacena los tokens de forma segura y usa el `access_token` para interactuar con la API de Miro.
5. Cuando el token expira, usa el `refresh_token` para obtener uno nuevo.

---

> **Nota:** Para el mapeo de columnas a estados, se recomienda mantener una tabla de correspondencia en la configuración del motor de sincronización. 
