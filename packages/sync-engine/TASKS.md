| Status | ID | Assignee | Description | Priority | Effort | Success Criteria | Dependencies |
|---|---|---|---|---|---|---|---|
| `[x]` | #103.7 | COSMOS | [Miro Client] Implementar la base del cliente con Axios (tras abandonar el SDK) | **CRITICAL** | 3h | El cliente se conecta y puede obtener un tablero | - |
| `[x]` | #103.8 | PHOENIX | Implementar la lógica central de sincronización (`syncAll`) | **HIGH** | 4h | El script compara `TASKS.md` y Miro, y puede crear/actualizar tarjetas | #103.7 |
| `[x]` | #103.9 | SAGE | Añadir tests unitarios y de integración para el `sync-engine` | **HIGH** | 3h | Los tests para el parser y el cliente de Miro pasan al 100% | #103.8 |
| `[x]` | #103.10 | KIRA | Crear un script ejecutable para la sincronización y documentar su uso | **MEDIUM** | 1h | Existe un `README.md` claro y un comando `npm run sync` funcional | #103.8 |
| `[ ]` | #105.1 | ATLAS | Integrar el cliente de Gamifier Admin en el `syncAll` | **HIGH** | 5h | La sincronización se realiza en los 3 planos (Git, Miro, Gamifier) | #103.8 | 
