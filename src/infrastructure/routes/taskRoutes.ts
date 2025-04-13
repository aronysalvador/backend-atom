import { Router } from 'express';
import { TaskController } from '../../application/controllers/TaskController';
import { TaskRepository } from '../../domain/repositories/TaskRepository';

export function createTaskRoutes(taskRepository: TaskRepository): Router {
  const router = Router();
  const taskController = new TaskController(taskRepository);

  // Crear una nueva tarea
  router.post('/', taskController.createTask.bind(taskController));

  // Obtener tareas por ID de usuario
  router.get('/user/:userId', taskController.getTasksByUserId.bind(taskController));

  // Actualizar una tarea
  router.put('/:id', taskController.updateTask.bind(taskController));

  // Eliminar una tarea
  router.delete('/:id', taskController.deleteTask.bind(taskController));

  // Actualizar estado de una tarea
  router.patch('/:id/status', taskController.updateTaskStatus.bind(taskController));

  return router;
} 