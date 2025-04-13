import express from 'express';
import cors from 'cors';
import { FirestoreUserRepository } from './infrastructure/repositories/FirestoreUserRepository';
import { FirestoreTaskRepository } from './infrastructure/repositories/FirestoreTaskRepository';
import { createUserRoutes } from './infrastructure/routes/userRoutes';
import { createTaskRoutes } from './infrastructure/routes/taskRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Repositories
const userRepository = new FirestoreUserRepository();
const taskRepository = new FirestoreTaskRepository();

// Routes
app.use('/api/users', createUserRoutes(userRepository));
app.use('/api/tasks', createTaskRoutes(taskRepository));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 