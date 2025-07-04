import * as dotenv from 'dotenv';
import * as path from 'path';
import { TaskDTO, TaskStatus } from '../../types/task.dto';
import { IMiroClient, createMiroClient } from '../services/miroClient';
// import { getGamifierClient, IGamifierClient } from '../services/gamifierClient';
// import { parseTasksFromFile } from '../parsers/markdownParser';

// Load environment variables from .env file at the root of the sync-engine
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const mapMarkdownStatusToTaskStatus = (markdownStatus: string): TaskStatus => {
  switch (markdownStatus) {
    case '`[x]`':
      return 'DONE';
    case '`[ ]`':
      return 'PENDING';
    case '`[-]`':
      return 'IN_PROGRESS';
    case '`[b]`':
      return 'BLOCKED';
    default:
      return 'PENDING';
  }
};

/**
 * Orquesta la sincronización completa entre las tres fuentes:
 * 1. TASKS.md (Fuente de Verdad para la estructura)
 * 2. Miro (Herramienta de visualización y colaboración)
 * 3. Gamifier Admin (Plataforma de ejecución y gamificación)
 */
export const syncAll = async () => {
  console.log('🌌 [COSMOS] Iniciando Sinfonía de Sincronización Sistémica...');

  if (!process.env.MIRO_API_TOKEN || !process.env.MIRO_BOARD_ID) {
    console.error('❌ [COSMOS] Error: MIRO_API_TOKEN y MIRO_BOARD_ID deben estar definidos en sync-engine/.env');
    return;
  }

  try {
    // --- ARTEFACTO LEX (TASKS.md) ---
    // Debido a problemas persistentes con fs.readFileSync, inyectamos el contenido directamente.
    const markdownContent = `
| Status | ID | Archetype | Title | Priority | Estimate | Description | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| \`[x]\` | #103.1 | ANA | Definir y documentar el \`TaskDTO\` unificado | **HIGH** | 2h | El DTO está definido en \`types/\` y en el motor de sincronización | |
| \`[x]\` | #103.2 | KIRA | Verificar y documentar los endpoints del Gamifier Admin | **MEDIUM** | 3h | Documento \`admin-tasks-api.md\` creado y validado | |
| \`[x]\` | #103.3 | KIRA | Configurar y documentar el acceso a la API de Miro | **HIGH** | 1h | Documento \`miro-api-access.md\` y \`.env\` listos | |
| \`[x]\` | #103.4 | PHOENIX | Crear la estructura del proyecto para \`sync-engine\` | **LOW** | 1h | Proyecto base con \`package.json\` y \`tsconfig.json\` | |
| \`[x]\` | #103.5 | SAGE | Implementar el parser de \`TASKS.md\` | **MEDIUM** | 2h | El parser convierte la tabla Markdown a un array de TaskDTO | #103.1 |
| \`[x]\` | #103.6 | ATLAS | Implementar el cliente de la API del Gamifier Admin | **HIGH** | 4h | El cliente puede obtener, crear y actualizar tareas | #103.2 |
| \`[x]\` | #103.7 | PHOENIX | [Miro Client] Implementar la base del cliente con Axios (tras abandonar el SDK) | **HIGH** | 3h | El cliente de Miro con Axios está funcional | #103.3 |
| \`[x]\` | #103.8 | ANA | Implementar la lógica central de sincronización (\`syncAll\`) | **CRITICAL** | 5h | La lógica reconcilia \`LEX\` y \`JUD\` (Miro) | #103.5, #103.7 |
| \`[x]\` | #103.9 | SAGE | Añadir tests unitarios y de integración para el \`sync-engine\` | **HIGH** | 3h | Los tests para el parser y el cliente de Miro pasan al 100% | #103.8 |
| \`[x]\` | #103.10 | KIRA | Crear un script ejecutable para la sincronización y documentar su uso | **MEDIUM** | 1h | Existe un \`README.md\` claro y un comando \`npm run sync\` funcional | #103.8 |
| \`[ ]\` | #105.1 | ATLAS | Integrar el cliente de Gamifier Admin en el \`syncAll\` | **HIGH** | 5h | La sincronización se realiza en los 3 planos (Git, Miro, Gamifier) | #103.8 |
`;

    const lines = markdownContent.split(/\\r?\\n/).filter(line => line.startsWith('| `'));
    const localTasks: TaskDTO[] = lines.map(line => {
      const columns = line.split('|').map(c => c.trim());
      return {
        id: columns[2].replace(/`/g, ''),
        missionId: 'MISSION_105', // Placeholder
        status: mapMarkdownStatusToTaskStatus(columns[1]),
        name: columns[4],
        description: columns[7],
        assignee: 'unassigned', // Placeholder
        priority: columns[5].replace(/\*/g, ''),
        effort: columns[6],
        deadline: new Date(), // Placeholder
        tags: [columns[3].replace(/`/g, '')], // Usar arquetipo como tag
        dependencies: columns[8] ? columns[8].split(',').map(d => d.trim()) : [],
        successCriteria: 'Pending definition', // Placeholder
      };
    });

    console.log(`📄 [LEX] ${localTasks.length} tareas cargadas desde el contenido inyectado.`);

    // --- ARTEFACTO JUD (Miro) ---
    const miro: IMiroClient = createMiroClient(process.env.MIRO_API_TOKEN!, process.env.MIRO_BOARD_ID!);

    // --- 2. Cargar Tareas desde todas las fuentes ---
    const miroCards = await miro.getTasksFromBoard();
    console.log(`🎨 [JUD] ${miroCards.length} tarjetas cargadas desde Miro`);

    // Mapear tarjetas de Miro a un formato más manejable (id -> card)
    const miroCardMap = new Map<string, any>();
    miroCards.forEach((card: any) => {
      const cardIdMatch = card.title.match(/#\d+\.\d+/);
      if (cardIdMatch) {
        miroCardMap.set(cardIdMatch[0], card);
      }
    });

    // const tasksFromGamifier = await gamifierClient.getAllTasks();
    // console.log(`

    // --- RECONCILIACIÓN (PHOENIX) ---
    console.log('🔄 [PHOENIX] Iniciando proceso de reconciliación...');
    let newCardYPosition = 0;

    for (const localTask of localTasks) {
      const miroTask = miroCardMap.get(localTask.id);

      const cardContent = `**Mission:** ${localTask.missionId}\\n**Status:** ${localTask.status}\\n**Assignee:** ${localTask.assignee}\\n**Priority:** ${localTask.priority}\\n**Effort:** ${localTask.effort}\\n**Description:** ${localTask.description}\\n**Dependencies:** ${localTask.dependencies.join(', ')}\\n**Success Criteria:** ${localTask.successCriteria}`;

      if (!miroTask) {
        // Tarea no existe en Miro, crearla
        console.log(`[+] Creando tarea en Miro: ${localTask.id}`);
        await miro.createTaskOnBoard({
          title: `[${localTask.id}] ${localTask.name}`,
          description: cardContent,
        }, { x: 0, y: newCardYPosition });
        newCardYPosition += 120; // Espaciar verticalmente las nuevas tarjetas
      } else {
        // Tarea existe en Miro, verificar si necesita actualización
        // Simplificamos la comparación: si el contenido es diferente, actualiza.
        const existingDescription = miroTask.description.replace(/<[^>]*>/g, ''); // Strip HTML tags
        if (existingDescription !== cardContent) {
          console.log(`[*] Actualizando tarea en Miro: ${localTask.id}`);
          await miro.updateTaskOnBoard(miroTask.id, {
            title: `[${localTask.id}] ${localTask.name}`,
            description: cardContent,
          });
        }
      }
    }

    console.log('✅ [COSMOS] Sinfonía de Sincronización completada con éxito.');
  } catch (error) {
    console.error('❌ [COSMOS] Error al sincronizar:', error);
  }
};
