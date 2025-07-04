# Sync Engine

Este paquete es el motor de sincronización de la Red de Acción Sistémica. Se encarga de mantener la coherencia entre `TASKS.md`, el tablero de Miro y el Gamifier Admin.

## Uso

### 1. Configuración del Entorno

Antes de ejecutar la sincronización, es necesario configurar las credenciales de la API de Miro.

1.  Cree un archivo llamado `.env` en la raíz de este directorio (`packages/sync-engine/.env`).
2.  Añada las siguientes variables a su archivo `.env`:

    ```env
    MIRO_API_TOKEN="tu_token_de_api_de_miro"
    MIRO_BOARD_ID="el_id_de_tu_tablero_de_miro"
    ```

    *   **`MIRO_API_TOKEN`**: Puede obtenerlo desde su perfil de desarrollador en Miro.
    *   **`MIRO_BOARD_ID`**: Puede encontrarlo en la URL de su tablero.

### 2. Ejecutar la Sincronización

Una vez configurado el entorno, puede ejecutar la sincronización desde la raíz de este paquete con el siguiente comando:

```bash
npm run sync
```

El script se encargará de leer las tareas de todas las fuentes, reconciliarlas y aplicar los cambios necesarios para mantener la armonía sistémica. 
