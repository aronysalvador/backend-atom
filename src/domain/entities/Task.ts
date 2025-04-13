export interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
} 