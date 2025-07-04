import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  const mockUser = { id: 'auth-user-id', email: 'auth@user.com' }; // Mock authenticated user

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
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password123' };
      const createdUser: Partial<User> = { id: 'user-id', email: 'test@example.com', password: 'hashedpassword' };

      jest.spyOn(prisma.user, 'create').mockResolvedValue(createdUser as User);

      const result = await service.create(createUserDto, mockUser);

      expect(result).toEqual(createdUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: createUserDto.email,
          password: expect.any(String) // Password should be hashed
        }),
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = 'user-id';
      const mockUserResult: Partial<User> = { id: userId, email: 'test@example.com' };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUserResult as User);

      const result = await service.findOne(userId);

      expect(result).toEqual(mockUserResult);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistent-id';

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a user by ID', async () => {
      const userId = 'user-id';
      const mockExistingUser: Partial<User> = { id: userId, isActive: true };
      const softDeletedUser: Partial<User> = { id: userId, isActive: false };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockExistingUser as User);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(softDeletedUser as User);

      const result = await service.remove(userId, mockUser);

      expect(result).toEqual(softDeletedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { isActive: false },
      });
    });

    it('should throw NotFoundException if user not found for removal', async () => {
        const userId = 'nonexistent-id';

        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

        await expect(service.remove(userId, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  // Add tests for findAll, update, and findOneByEmail (if applicable)
});
