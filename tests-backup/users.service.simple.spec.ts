import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService (Simple)', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      const mockUsers = [mockUser];
      prismaService.user.findMany = jest.fn().mockResolvedValue(mockUsers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });

    it('should handle empty result', async () => {
      // Arrange
      prismaService.user.findMany = jest.fn().mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      // Arrange
      const userId = 'user-123';
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await service.findOne(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 'nonexistent-id';
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      // Arrange
      const userId = 'user-123';
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const mockCurrentUser = { id: 'admin-123' };
      
      prismaService.user.create = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await service.create(createUserDto, mockCurrentUser);

      // Assert
      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      // Arrange
      const userId = 'user-123';
      const updateUserDto = { name: 'Updated Name' };
      const mockCurrentUser = { id: 'admin-123' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.user.update = jest.fn().mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(userId, updateUserDto, mockCurrentUser);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // Arrange
      const userId = 'user-123';
      const mockCurrentUser = { id: 'admin-123' };
      const deletedUser = { ...mockUser, deletedAt: new Date() };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.user.update = jest.fn().mockResolvedValue(deletedUser);

      // Act
      const result = await service.remove(userId, mockCurrentUser);

      // Assert
      expect(result).toEqual(deletedUser);
      expect(prismaService.user.update).toHaveBeenCalled();
    });
  });
}); 