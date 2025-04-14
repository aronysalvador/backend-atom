import { Router } from 'express';
import { UserController } from '../../application/controllers/UserController';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { authMiddleware } from '../middleware/authMiddleware';

export function createUserRoutes(userRepository: UserRepository): Router {
  const router = Router();
  const userController = new UserController(userRepository);

  // Rutas públicas
  router.post('/', userController.createUser.bind(userController));
  router.post('/login', userController.login.bind(userController));

  // Rutas protegidas
  router.get('/:id', authMiddleware, userController.getUserById.bind(userController));

  return router;
} 