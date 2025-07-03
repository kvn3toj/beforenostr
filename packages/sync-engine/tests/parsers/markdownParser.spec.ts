import { parseTasksFromFile } from '../../src/parsers/markdownParser';
import * as fs from 'fs';
import * as path from 'path';

// Mock the fs module to avoid actual file system reads
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('Markdown Parser', () => {
  it('should parse a line of markdown into a TaskDTO', () => {
    const markdownContent = `
| Status | ID | Assignee | Description | Priority | Effort | Success Criteria | Dependencies |
|---|---|---|---|---|---|---|---|
| \`[ ]\` | #103.1 | **ANA** | Definir y documentar el TaskDTO unificado | **CRITICAL** | 2h | DTO está en shared-types y documentado | — |
`;

    // Setup the mock for readFileSync
    mockedFs.readFileSync.mockReturnValue(markdownContent);
    mockedFs.existsSync.mockReturnValue(true);

    const tasks = parseTasksFromFile('dummy/path/TASKS.md');

    expect(tasks).toHaveLength(1);
    const task = tasks[0];

    expect(task.id).toBe('103.1');
    expect(task.status).toBe('PENDING');
    expect(task.assignee).toBe('ANA');
    expect(task.description).toBe('Definir y documentar el TaskDTO unificado');
    expect(task.priority).toBe('CRITICAL');
    expect(task.effort).toBe(2);
    expect(task.successCriteria).toBe('DTO está en shared-types y documentado');
    expect(task.dependencies).toEqual([]);
  });
});
