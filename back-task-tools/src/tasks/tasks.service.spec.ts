import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TaskPriority, TaskStatus } from './enums/task.enum';

describe('TasksService', () => {
  let service!: TasksService;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateMetrics', () => {
    it('should calculate recursive estimates correctly', () => {
      const task: Task = {
        id: 1,
        title: 'Main Task',
        description: 'Main',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        estimate: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: [
          {
            id: 2,
            title: 'Subtask 1',
            description: 'Sub 1',
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.MEDIUM,
            estimate: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            subtasks: [],
          },
          {
            id: 3,
            title: 'Subtask 2',
            description: 'Sub 2',
            status: TaskStatus.TODO,
            priority: TaskPriority.LOW,
            estimate: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
            subtasks: [],
          },
        ],
      };

      const result = service.calculateMetrics(task);

      expect(result).toEqual({
        total: 18,
        todo: 13,
        inProgress: 5,
      });
    });
  });

  describe('create', () => {
    it('should create a normal task', async () => {
      const dto = {
        title: 'New Task',
        description: 'Description',
      };

      mockRepository.create.mockReturnValue(dto);

      mockRepository.save.mockResolvedValue({
        id: 1,
        ...dto,
      });

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('should throw if parent task does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          title: 'Subtask',
          description: 'Sub',
          parentTaskId: 999,
        } as any),
      ).rejects.toThrow('Parent task not found');
    });
  });

  describe('update', () => {
    it('should set completedAt when status is DONE', async () => {
      const task = {
        id: 1,
        title: 'Task',
        description: 'Desc',
        status: TaskStatus.TODO,
        subtasks: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(task as Task);

      mockRepository.save.mockImplementation((data) => data);

      const result = await service.update(1, {
        status: TaskStatus.DONE,
      });

      expect(result.status).toBe(TaskStatus.DONE);
      expect(result.completedAt).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const task = {
        id: 1,
        title: 'Task',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(task as Task);

      mockRepository.remove.mockResolvedValue(task);

      const result = await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalled();
      expect(result.message).toBe('Task deleted successfully');
    });
  });
});
