import { Task } from '../../domain/entities/Task';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { db } from '../config/firebase';

export class FirestoreTaskRepository implements TaskRepository {
  private readonly collection = 'tasks';

  async create(task: Task): Promise<Task> {
    const taskData = {
      ...task,
      createdAt: new Date(),
      priority: task.priority || 'medium'
    };

    const taskRef = await db.collection(this.collection).add(taskData);
    
    return {
      ...taskData,
      id: taskRef.id
    };
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const snapshot = await db.collection(this.collection)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    const taskRef = db.collection(this.collection).doc(id);
    const doc = await taskRef.get();
    
    if (!doc.exists) return null;
    
    await taskRef.update(task);
    
    const updatedDoc = await taskRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as Task;
  }

  async delete(id: string): Promise<boolean> {
    const taskRef = db.collection(this.collection).doc(id);
    const doc = await taskRef.get();
    
    if (!doc.exists) return false;
    
    await taskRef.delete();
    return true;
  }

  async updateStatus(id: string, status: 'pending' | 'completed'): Promise<Task | null> {
    const taskRef = db.collection(this.collection).doc(id);
    const doc = await taskRef.get();
    
    if (!doc.exists) return null;
    
    await taskRef.update({ status });
    
    const updatedDoc = await taskRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as Task;
  }
} 