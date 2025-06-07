import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
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

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should create a new user successfully', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null); // Email not taken
      prismaService.user.create = jest.fn().mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(expect.objectContaining({
        email: createUserDto.email,
        name: createUserDto.name,
      }));
      expect(mockBcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
        },
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });

    it('should handle bcrypt hashing errors', async () => {
      // Arrange
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
      mockBcrypt.hash.mockRejectedValue(new Error('Hashing failed') as never);

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow('Hashing failed');
    });
  });

  describe('findAll', () => {
    it('should return all users excluding deleted ones', async () => {
      // Arrange
      const mockUsers = [mockUser, { ...mockUser, id: 'user-456', email: 'test2@example.com' }];
      prismaService.user.findMany = jest.fn().mockResolvedValue(mockUsers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should return empty array when no users found', async () => {
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
        where: { id: userId, deletedAt: null },
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

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      // Arrange
      const email = 'test@example.com';
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await service.findOneByEmail(email);

      // Assert
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email, deletedAt: null },
      });
    });

    it('should return null when user not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const result = await service.findOneByEmail(email);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateUserDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should update a user successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const updatedUser = { ...mockUser, ...updateUserDto };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.user.update = jest.fn().mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(userId, updateUserDto);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserDto,
      });
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      // Arrange
      const userId = 'nonexistent-id';
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });

    it('should hash password when updating password', async () => {
      // Arrange
      const userId = 'user-123';
      const updateWithPassword = { ...updateUserDto, password: 'newPassword123' };
      const hashedPassword = 'newHashedPassword123';
      
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.user.update = jest.fn().mockResolvedValue({
        ...mockUser,
        ...updateWithPassword,
        password: hashedPassword,
      });

      // Act
      const result = await service.update(userId, updateWithPassword);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { ...updateWithPassword, password: hashedPassword },
      });
    });
  });

  describe('remove', () => {
    it('should soft delete a user successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const deletedUser = { ...mockUser, deletedAt: new Date() };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.user.update = jest.fn().mockResolvedValue(deletedUser);

      // Act
      const result = await service.remove(userId);

      // Assert
      expect(result).toEqual(deletedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException when removing non-existent user', async () => {
      // Arrange
      const userId = 'nonexistent-id';
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });
  });

  describe('validateCredentials', () => {
    it('should return user when credentials are valid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      mockBcrypt.compare.mockResolvedValue(true as never);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await service.validateCredentials(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password123';
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const result = await service.validateCredentials(email, password);

      // Assert
      expect(result).toBeNull();
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongPassword';
      mockBcrypt.compare.mockResolvedValue(false as never);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await service.validateCredentials(email, password);

      // Assert
      expect(result).toBeNull();
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });
  });
}); 