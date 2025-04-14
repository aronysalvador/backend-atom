import { Request, Response } from 'express';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { Task } from '../../domain/entities/Task';

export class TaskController {
  constructor(private taskRepository: TaskRepository) {}

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { userId, title, description, status, priority } = req.body;

      if (!userId || !title || !description || !status || !priority) {
        res.status(400).json({
          error: 'Missing required fields',
          requiredFields: {
            userId: 'User email',
            title: 'Task title',
            description: 'Task description',
            status: 'Task status (pending or completed)',
            priority: 'Task priority (low, medium, or high)'
          }
        });
        return;
      }

      if (!['pending', 'completed'].includes(status)) {
        res.status(400).json({ error: 'Status must be either pending or completed' });
        return;
      }

      if (!['low', 'medium', 'high'].includes(priority)) {
        res.status(400).json({ error: 'Priority must be either low, medium, or high' });
        return;
      }

      const task: Task = {
        userId,
        title,
        description,
        status,
        priority,
        createdAt: new Date()
      };

      const createdTask = await this.taskRepository.create(task);
      res.status(201).json(createdTask);
    } catch (error) {
      res.status(500).json({ error: 'Error creating task' });
    }
  }

  async getTasksByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'userId is required as a query parameter' });
        return;
      }

      const tasks = await this.taskRepository.findByUserId(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error getting tasks' });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, status, priority } = req.body;

      if (status && !['pending', 'completed'].includes(status)) {
        res.status(400).json({ error: 'Status must be either pending or completed' });
        return;
      }

      if (priority && !['low', 'medium', 'high'].includes(priority)) {
        res.status(400).json({ error: 'Priority must be either low, medium, or high' });
        return;
      }

      const taskData: Partial<Task> = {
        title,
        description,
        status,
        priority,
      };

      const updatedTask = await this.taskRepository.update(id, taskData);
      
      if (!updatedTask) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Error updating task' });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.taskRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting task' });
    }
  }   

  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'completed'].includes(status)) {
        res.status(400).json({ error: 'Status must be either pending or completed' });
        return;
      }

      const updatedTask = await this.taskRepository.updateStatus(id, status);
      
      if (!updatedTask) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Error updating task status' });
    }
  }
} 