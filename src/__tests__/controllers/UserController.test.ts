import { Request, Response } from 'express';
import { UserController } from '../../application/controllers/UserController';
import { UserRepository } from '../../domain/repositories/UserRepository';

describe('UserController', () => {
  let userController: UserController;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    // Mock del repositorio
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
    };

    // Mock de response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
    };

    userController = new UserController(mockUserRepository as UserRepository);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = {
        userId: 'test@test.com',
        name: 'Test',
        lastName: 'User',
        dateBirth: new Date('1990-01-01'),
      };

      mockRequest = {
        body: mockUser,
      };

      const createdUser = { ...mockUser, id: '1', createdAt: new Date() };
      mockUserRepository.create.mockResolvedValue(createdUser);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toHaveProperty('user');
      expect(responseObject).toHaveProperty('token');
      expect(responseObject.user).toEqual(createdUser);
    });

    it('should return 400 for invalid user data', async () => {
      mockRequest = {
        body: {
          userId: '',  // Invalid userId
          name: 'Test',
          lastName: 'User',
          dateBirth: new Date('1990-01-01'),
        },
      };

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'Validation failed');
    });

    it('should handle repository errors', async () => {
      const mockUser = {
        userId: 'test@test.com',
        name: 'Test',
        lastName: 'User',
        dateBirth: new Date('1990-01-01'),
      };

      mockRequest = {
        body: mockUser,
      };

      mockUserRepository.create.mockRejectedValue(new Error('Database error'));

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toHaveProperty('error', 'Error creating user');
    });

    it('should handle validation error with details', async () => {
      const mockUser = {
        userId: 'test@test.com',
        name: 'Test',
        lastName: 'User',
        dateBirth: new Date('1990-01-01'),
      };

      mockRequest = {
        body: mockUser,
      };

      const validationError = new Error(JSON.stringify({ field: 'userId', message: 'Invalid format' }));
      mockUserRepository.create.mockRejectedValue(validationError);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'Validation failed');
      expect(responseObject).toHaveProperty('details');
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: '1',
        userId: 'test@test.com',
        name: 'Test',
        lastName: 'User',
        dateBirth: new Date('1990-01-01'),
        createdAt: new Date(),
      };

      mockRequest = {
        body: { userId: 'test@test.com' },
      };

      mockUserRepository.findByUserId.mockResolvedValue(mockUser);

      await userController.login(mockRequest as Request, mockResponse as Response);

      expect(responseObject).toHaveProperty('token');
      expect(responseObject).toHaveProperty('user');
      expect(responseObject.user).toEqual(mockUser);
    });

    it('should return 401 for non-existent user', async () => {
      mockRequest = {
        body: { userId: 'nonexistent@test.com' },
      };

      mockUserRepository.findByUserId.mockResolvedValue(null);

      await userController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject).toHaveProperty('error', 'User not found');
    });

    it('should return 400 when userId is missing', async () => {
      mockRequest = {
        body: {},
      };

      await userController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('error', 'userId is required');
    });

    it('should handle login errors', async () => {
      mockRequest = {
        body: { userId: 'test@test.com' },
      };

      mockUserRepository.findByUserId.mockRejectedValue(new Error('Database error'));

      await userController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toHaveProperty('error', 'Error during login');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: '1',
        userId: 'test@test.com',
        name: 'Test',
        lastName: 'User',
        dateBirth: new Date('1990-01-01'),
        createdAt: new Date(),
      };

      mockRequest = {
        params: { id: '1' },
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(responseObject).toEqual(mockUser);
    });

    it('should return 404 for non-existent user', async () => {
      mockRequest = {
        params: { id: 'nonexistent' },
      };

      mockUserRepository.findById.mockResolvedValue(null);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toHaveProperty('error', 'User not found');
    });

    it('should handle getUserById errors', async () => {
      mockRequest = {
        params: { id: '1' },
      };

      mockUserRepository.findById.mockRejectedValue(new Error('Database error'));

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toHaveProperty('error', 'Error getting user');
    });
  });
}); 