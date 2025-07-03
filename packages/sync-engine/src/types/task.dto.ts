/**
 * @file This file defines the unified Data Transfer Object (DTO) for a Task.
 * @description This DTO serves as the single source of truth for the structure of a task
 * across different parts of the CoomÜnity ecosystem, such as TASKS.md, Miro, and the Gamifier Admin.
 *
 * @see 103.1 - Systemic TO-DO List
 *
 * @note [DEUDA TÉCNICA] This file is a temporary duplication of `types/task.dto.ts`.
 * It was created to resolve a persistent module resolution issue within the `sync-engine` package.
 * This should be removed and replaced with a direct workspace dependency on `@coomunity/shared-types`
 * as soon as the NPM environment issues are resolved.
 */

export interface TaskDTO {
    id: string;                 // Unique identifier (e.g., '#103.1')
    missionId: string;          // Parent mission ID (e.g., '#103')
    description: string;        // The task's description
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED' | 'IN_REVIEW';
    assignee: string;           // Who is responsible (e.g., 'ANA', 'SAGE')
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    effort: number;             // Estimated effort in hours
    dependencies: string[];     // Array of task IDs this task depends on
    successCriteria: string;    // What defines success for this task
}
