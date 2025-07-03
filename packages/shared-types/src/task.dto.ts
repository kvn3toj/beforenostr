/**
 * Data Transfer Object (DTO) que representa una tarea sincronizable en la Red de Acción Sistémica de CoomÜnity.
 * Cada campo está alineado con la gestión fractal y la trazabilidad de misiones.
 */
export interface TaskDTO {
  /**
   * Identificador único de la tarea (ej. '103.1').
   */
  id: string;

  /**
   * Identificador de la misión principal a la que pertenece la tarea (ej. '103').
   */
  missionId: string;

  /**
   * Descripción clara y concisa de la tarea.
   */
  description: string;

  /**
   * Estado actual de la tarea.
   * - 'PENDING': No iniciada
   * - 'IN_PROGRESS': En ejecución
   * - 'DONE': Completada
   * - 'BLOCKED': Bloqueada por dependencia o impedimento
   */
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';

  /**
   * Nombre del Guardián responsable de la tarea (ej. 'ANA', 'ATLAS').
   */
  assignee: string;

  /**
   * Prioridad estratégica de la tarea.
   * - 'CRITICAL': Crítica para el éxito de la misión
   * - 'HIGH': Alta prioridad
   * - 'MEDIUM': Prioridad media
   * - 'LOW': Prioridad baja
   */
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

  /**
   * Estimación de esfuerzo en horas para completar la tarea.
   */
  effort: number;

  /**
   * IDs de tareas de las que depende esta tarea (ej. ['103.1']).
   */
  dependencies: string[];

  /**
   * Criterio de éxito claro y verificable para considerar la tarea como completada.
   */
  successCriteria: string;
}
