import axios from 'axios';
import { getMiroClient, IMiroClient, resetMiroClient } from '../../src/services/miroClient';
import { TaskDTO } from '../../src/types/task.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Miro Client', () => {
  let miroClient: IMiroClient;
  const boardId = 'test-board-id';
  const accessToken = 'test-token';

  beforeEach(() => {
    // Mock the create method to return a mocked axios instance
    // This must be done BEFORE the client is instantiated
    mockedAxios.create.mockReturnValue(mockedAxios);
    // Reset the singleton instance before each test
    resetMiroClient();
    miroClient = getMiroClient(accessToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a board correctly', async () => {
    const boardData = { id: boardId, name: 'Test Board' };
    mockedAxios.get.mockResolvedValue({ data: boardData });

    const board = await miroClient.getBoard(boardId);

    expect(board).toEqual(boardData);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/boards/${boardId}`);
  });

  it('should fetch tasks from a board correctly', async () => {
    const tasksData = { data: [{ id: 'task-1' }, { id: 'task-2' }] };
    mockedAxios.get.mockResolvedValue({ data: tasksData });

    const tasks = await miroClient.getTasksFromBoard(boardId);

    expect(tasks).toEqual(tasksData.data);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/boards/${boardId}/app_cards`);
  });

  it('should create a task on a board correctly', async () => {
    const task: TaskDTO = {
        id: '#123.1',
        missionId: '#123',
        description: 'New test task',
        status: 'PENDING',
        assignee: 'SAGE',
        priority: 'HIGH',
        effort: 5,
        dependencies: [],
        successCriteria: 'It works'
    };
    const position = { x: 100, y: 200 };
    const createdTaskData = { id: 'new-miro-id', data: { title: '[#123.1] New test task' } };
    mockedAxios.post.mockResolvedValue({ data: createdTaskData });

    const result = await miroClient.createTaskOnBoard(boardId, task, position);

    expect(result).toEqual(createdTaskData);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `/boards/${boardId}/app_cards`,
      expect.objectContaining({
        data: { title: `[${task.id}] ${task.description}` },
        position: expect.objectContaining(position),
      })
    );
  });

  it('should update a task on a board correctly', async () => {
    const taskId = 'existing-task-id';
    const taskUpdate: Partial<TaskDTO> = { id: '#123.1', description: 'Updated description' };
    const updatedTaskData = { id: taskId, data: { title: '[#123.1] Updated description' } };
    mockedAxios.patch.mockResolvedValue({ data: updatedTaskData });

    const result = await miroClient.updateTaskOnBoard(boardId, taskId, taskUpdate);

    expect(result).toEqual(updatedTaskData);
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      `/boards/${boardId}/app_cards/${taskId}`,
      expect.objectContaining({
        data: { title: `[${taskUpdate.id}] ${taskUpdate.description}` },
      })
    );
  });
});
