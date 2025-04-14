import { Request, Response } from 'express';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { UserValidator } from '../validators/UserValidator';

export class UserController {
  constructor(private userRepository: UserRepository) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId, name, lastName, dateBirth } = req.body;

      const validation = UserValidator.validateUser({ userId, name, lastName, dateBirth });
      
      if (!validation.isValid) {
        res.status(400).json({
          error: 'Validation failed',
          details: validation.errors
        });
        return;
      }

      const user: User = {
        userId: userId.trim(),
        name: name.trim(),
        lastName: lastName.trim(),
        dateBirth: dateBirth.trim(),
        createdAt: new Date()
      };

      const createdUser = await this.userRepository.create(user);
      res.status(201).json(createdUser);
    } catch (error) {
      if (error instanceof Error) {
        try {
          const validationErrors = JSON.parse(error.message);
          res.status(400).json({
            error: 'Validation failed',
            details: validationErrors
          });
        } catch {
          res.status(500).json({ error: 'Error creating user' });
        }
      } else {
        res.status(500).json({ error: 'Error creating user' });
      }
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error getting user' });
    }
  }

  async getUserByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        // Si no hay userId en el query, devolver todos los usuarios
        const users = await this.userRepository.findAll();
        res.json(users);
        return;
      }

      const user = await this.userRepository.findByUserId(userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error getting user' });
    }
  }

  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userRepository.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId, name, lastName, dateBirth } = req.body;

      const validation = UserValidator.validateUser({ userId, name, lastName, dateBirth });
      
      if (!validation.isValid) {
        res.status(400).json({
          error: 'Validation failed',
          details: validation.errors
        });
        return;
      }

      const userData: Partial<User> = {
        userId: userId.trim(),
        name: name.trim(),
        lastName: lastName.trim(),
        dateBirth: dateBirth.trim()
      };
      
      const updatedUser = await this.userRepository.update(id, userData);
      
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        try {
          const validationErrors = JSON.parse(error.message);
          res.status(400).json({
            error: 'Validation failed',
            details: validationErrors
          });
        } catch {
          res.status(500).json({ error: 'Error updating user' });
        }
      } else {
        res.status(500).json({ error: 'Error updating user' });
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.userRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  }
} 