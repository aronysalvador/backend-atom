import { User } from '../entities/User';

export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByUserId(userId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
} 