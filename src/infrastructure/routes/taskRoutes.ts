import { Router } from 'express';
import { TaskController } from '../../application/controllers/TaskController';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { authMiddleware } from '../middleware/authMiddleware';

export function createTaskRoutes(taskRepository: TaskRepository): Router {
  const router = Router();
  const taskController = new TaskController(taskRepository);

  // Todas las rutas de tareas requieren autenticación
  router.use(authMiddleware);

  // Crear una nueva tarea
  router.post('/', taskController.createTask.bind(taskController));

  // Obtener tareas por ID de usuario
  router.get('/user', taskController.getTasksByUserId.bind(taskController));

  // Actualizar una tarea (usando query parameter)
  router.put('/', taskController.updateTask.bind(taskController));

  // Eliminar una tarea (usando query parameter)
  router.delete('/', taskController.deleteTask.bind(taskController));

  return router;
} 