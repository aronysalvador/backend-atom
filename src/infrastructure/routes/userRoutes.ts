import { Router } from 'express';
import { UserController } from '../../application/controllers/UserController';
import { UserRepository } from '../../domain/repositories/UserRepository';

export function createUserRoutes(userRepository: UserRepository): Router {
  const router = Router();
  const userController = new UserController(userRepository);

  router.post('/', userController.createUser.bind(userController));
  router.get('/', userController.getAllUsers.bind(userController));
  router.get('/:id', userController.getUserById.bind(userController));
  router.get('/userId/:userId', userController.getUserByUserId.bind(userController));
  router.put('/:id', userController.updateUser.bind(userController));
  router.delete('/:id', userController.deleteUser.bind(userController));

  return router;
} 