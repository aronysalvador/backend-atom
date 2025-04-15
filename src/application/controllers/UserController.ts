import { Request, Response } from 'express';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserValidator } from '../validators/UserValidator';
import { User } from '../../domain/entities/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '1';
const TOKEN_EXPIRATION = '15m'; // 15 minutos

export class UserController {
  constructor(private userRepository: UserRepository) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
      }

      const user = await this.userRepository.findByUserId(userId);
      
      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      const token = jwt.sign(
        { 
          userId: user.userId,
          id: user.id 
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      res.json({ 
        token, 
        user,
        expiresIn: "15 minutes"
      });
    } catch (error) {
      res.status(500).json({ error: 'Error during login' });
    }
  }

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
        dateBirth: dateBirth instanceof Date ? dateBirth : new Date(dateBirth),
        createdAt: new Date()
      };

      const createdUser = await this.userRepository.create(user);
      
      const token = jwt.sign(
        { 
          userId: createdUser.userId,
          id: createdUser.id 
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      res.status(201).json({ 
        user: createdUser, 
        token,
        expiresIn: "15 minutes"
      });
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
} 