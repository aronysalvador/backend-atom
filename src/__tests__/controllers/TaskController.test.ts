import { Request, Response } from 'express';
import { TaskController } from '../../application/controllers/TaskController';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { Task } from '../../domain/entities/Task';

describe('TaskController', () => {
  let taskController: TaskController;
  let mockTaskRepository: jest.Mocked<TaskRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateStatus: jest.fn(),
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
      send: jest.fn(),
    };

    taskController = new TaskController(mockTaskRepository as TaskRepository);
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const mockTask = {
        userId: 'test@test.com',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending' as const,
        priority: 'medium' as const,
      };

      mockRequest = {
        body: mockTask,
      };

      const createdTask: Task = { 
        ...mockTask, 
        id: '1', 
        createdAt: new Date() 
      };
      
      mockTaskRepository.create.mockResolvedValue(createdTask);

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toEqual(createdTask);
    });

    it('should return 400 for missing required fields', async () => {
      mockRequest = {
        body: {
          userId: 'test@test.com',
          // missing other required fields
        },
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'Missing required fields');
      expect(responseObject).toHaveProperty('requiredFields');
    });

    it('should return 400 for invalid status', async () => {
      mockRequest = {
        body: {
          userId: 'test@test.com',
          title: 'Test Task',
          description: 'Test Description',
          status: 'invalid',
          priority: 'medium' as const,
        },
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'Status must be either pending or completed');
    });

    it('should return 400 for invalid priority', async () => {
      mockRequest = {
        body: {
          userId: 'test@test.com',
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending' as const,
          priority: 'invalid',
        },
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'Priority must be either low, medium, or high');
    });

    it('should handle repository errors', async () => {
      const mockTask = {
        userId: 'test@test.com',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending' as const,
        priority: 'medium' as const,
      };

      mockRequest = {
        body: mockTask,
      };

      mockTaskRepository.create.mockRejectedValue(new Error('Database error'));

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toHaveProperty('error', 'Error creating task');
    });
  });

  describe('getTasksByUserId', () => {
    it('should get tasks by userId successfully', async () => {
      const mockTasks: Task[] = [
        { id: '1', userId: 'test@test.com', title: 'Task 1', description: 'Desc 1', status: 'pending', priority: 'high', createdAt: new Date() },
        { id: '2', userId: 'test@test.com', title: 'Task 2', description: 'Desc 2', status: 'completed', priority: 'low', createdAt: new Date() },
      ];

      mockRequest = {
        query: { userId: 'test@test.com' },
      };

      mockTaskRepository.findByUserId.mockResolvedValue(mockTasks);

      await taskController.getTasksByUserId(mockRequest as Request, mockResponse as Response);

      expect(responseObject).toEqual(mockTasks);
    });

    it('should return 400 when userId is missing', async () => {
      mockRequest = {
        query: {},
      };

      await taskController.getTasksByUserId(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'userId is required as a query parameter');
    });

    it('should handle repository errors', async () => {
      mockRequest = {
        query: { userId: 'test@test.com' },
      };

      mockTaskRepository.findByUserId.mockRejectedValue(new Error('Database error'));

      await taskController.getTasksByUserId(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toHaveProperty('error', 'Error getting tasks');
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        status: 'completed' as const,
        priority: 'high' as const,
      };

      mockRequest = {
        query: { id: '1' },
        body: updateData,
      };

      const updatedTask: Task = { 
        id: '1', 
        ...updateData, 
        userId: 'test@test.com', 
        description: 'Original Desc', 
        createdAt: new Date() 
      };
      
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      await taskController.updateTask(mockRequest as Request, mockResponse as Response);

      expect(responseObject).toEqual(updatedTask);
    });

    it('should return 400 when task id is missing', async () => {
      mockRequest = {
        query: {},
        body: { title: 'Updated Title' },
      };

      await taskController.updateTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'Task id is required as a query parameter');
    });

    it('should return 404 when task is not found', async () => {
      mockRequest = {
        query: { id: 'nonexistent' },
        body: { title: 'Updated Title' },
      };

      mockTaskRepository.update.mockResolvedValue(null);

      await taskController.updateTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid status', async () => {
      mockRequest = {
        query: { id: '1' },
        body: { status: 'invalid' },
      };

      await taskController.updateTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'Status must be either pending or completed');
    });

    it('should return 400 for invalid priority', async () => {
      mockRequest = {
        query: { id: '1' },
        body: { priority: 'invalid' },
      };

      await taskController.updateTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'Priority must be either low, medium, or high');
    });

    it('should handle repository errors', async () => {
      mockRequest = {
        query: { id: '1' },
        body: { title: 'Updated Title' },
      };

      mockTaskRepository.update.mockRejectedValue(new Error('Database error'));

      await taskController.updateTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toHaveProperty('error', 'Error updating task');
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockRequest = {
        query: { id: '1' },
      };

      mockTaskRepository.delete.mockResolvedValue(true);

      await taskController.deleteTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when task id is missing', async () => {
      mockRequest = {
        query: {},
      };

      await taskController.deleteTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'Task id is required as a query parameter');
    });

    it('should return 404 when task is not found', async () => {
      mockRequest = {
        query: { id: 'nonexistent' },
      };

      mockTaskRepository.delete.mockResolvedValue(false);

      await taskController.deleteTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toHaveProperty('error', 'Task not found');
    });

    it('should handle repository errors', async () => {
      mockRequest = {
        query: { id: '1' },
      };

      mockTaskRepository.delete.mockRejectedValue(new Error('Database error'));

      await taskController.deleteTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toHaveProperty('error', 'Error deleting task');
    });
  });
}); 