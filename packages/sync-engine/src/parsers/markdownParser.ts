import * as fs from 'fs';
import * as path from 'path';
import { TaskDTO } from '../types/task.dto';

type TaskStatusMarkdown = '`[ ]`' | '`[x]`' | '`[-]`';
type TaskPriorityMarkdown = '**CRITICAL**' | 'High' | 'Medium' | 'Low';

/**
 * Convierte el estado de Markdown al estado del DTO.
 */
const parseStatus = (statusMd: string): TaskDTO['status'] => {
  const statusMap: Record<TaskStatusMarkdown, TaskDTO['status']> = {
    '`[ ]`': 'PENDING',
    '`[x]`': 'DONE',
    '`[-]`': 'BLOCKED',
  };
  return statusMap[statusMd.trim() as TaskStatusMarkdown] || 'PENDING';
};

/**
 * Convierte la prioridad de Markdown a la prioridad del DTO.
 */
const parsePriority = (priorityMd: string): TaskDTO['priority'] => {
  const priorityCleaned = priorityMd.replace(/\*\*/g, '').trim().toUpperCase();
  const priorityMap: Record<string, TaskDTO['priority']> = {
    CRITICAL: 'CRITICAL',
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW',
  };
  return priorityMap[priorityCleaned] || 'MEDIUM';
};

/**
 * Parsea el campo de dependencias.
 */
const parseDependencies = (depsMd: string): string[] => {
  if (!depsMd || depsMd.trim() === '—' || depsMd.trim() === '-') {
    return [];
  }
  return depsMd.split(',').map(d => d.trim());
};

/**
 * Parsea el campo de esfuerzo a un número.
 */
const parseEffort = (effortMd: string): number => {
    const hours = parseFloat(effortMd.replace('h', '').trim());
    return isNaN(hours) ? 0 : hours;
}


/**
 * Parsea el contenido de un archivo TASKS.md y lo convierte en un array de TaskDTO.
 * @param filePath - Ruta al archivo TASKS.md. Por defecto, busca en la raíz del proyecto.
 * @returns Un array de TaskDTO.
 */
export const parseTasksFromFile = (
  filePath: string = path.join(process.cwd(), 'TASKS.md')
): TaskDTO[] => {
  if (!fs.existsSync(filePath)) {
    console.error(`[Parser] Error: Archivo no encontrado en la ruta ${filePath}`);
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  console.log('--- INICIO CONTENIDO ARCHIVO ---');
  console.log(fileContent);
  console.log('--- FIN CONTENIDO ARCHIVO ---');


  const lines = fileContent.split(/\\r?\\n/).filter(line => line.startsWith('| `'));
  console.log(`[Parser] Líneas de tareas encontradas: ${lines.length}`);

  const tasks: TaskDTO[] = lines.map(line => {
    const columns = line.split('|').map(c => c.trim());
    // columns[0] is empty because the line starts with |

    const id = columns[2].replace(/#/g, '');

    const task: TaskDTO = {
      status: parseStatus(columns[1]),
      id,
      missionId: id.split('.')[0],
      assignee: columns[3].replace(/\*\*/g, ''),
      description: columns[4].replace(/\*\*/g, ''),
      priority: parsePriority(columns[5]),
      effort: parseEffort(columns[6]),
      successCriteria: columns[7],
      dependencies: parseDependencies(columns[8]),
    };

    return task;
  });

  return tasks;
};
