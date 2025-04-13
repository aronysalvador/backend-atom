import { Task } from '../entities/Task';

export interface TaskRepository {
  create(task: Task): Promise<Task>;
  findByUserId(userId: string): Promise<Task[]>;
  update(id: string, task: Partial<Task>): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  updateStatus(id: string, status: 'pending' | 'completed'): Promise<Task | null>;
} 