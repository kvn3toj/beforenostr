import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client'; // Assuming Prisma generates types here
import { CreateUserDto } from '../admin/users/dto/create-user.dto'; // Assuming DTO location
import { UpdateUserDto } from '../admin/users/dto/update-user.dto'; // Assuming DTO location

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: { // Mock PrismaService methods used by UsersService
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(), // Assuming hard delete might be used internally sometimes
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
      const createdUser: Partial<User> = { id: 'user-id', email: 'test@example.com' }; // Mock return value
      
      // Mock prisma.user.create
      jest.spyOn(prisma.user, 'create').mockResolvedValue(createdUser as User); // Cast to User as mockResolvedValue expects the full type

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ email: createUserDto.email }), // Check if email is passed
      });
      // Add check for password hashing if done in service, requires mocking bcrypt
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = 'user-id';
      const mockUser: Partial<User> = { id: userId, email: 'test@example.com' };

      // Mock prisma.user.findUnique
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as User); // Cast to User

      const result = await service.findOne(userId);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should return null if user not found', async () => {
      const userId = 'nonexistent-id';

      // Mock prisma.user.findUnique to return null
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const result = await service.findOne(userId);

      expect(result).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });

  describe('remove', () => {
    it('should soft delete a user by ID', async () => {
      const userId = 'user-id';
      const deletedUser: Partial<User> = { id: userId, deletedAt: new Date() }; // Mock return value for soft delete

      // Mock prisma.user.update for soft delete (assuming soft delete updates a deletedAt field)
      jest.spyOn(prisma.user, 'update').mockResolvedValue(deletedUser as User); // Cast to User

      const result = await service.remove(userId);

      expect(result).toEqual(deletedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should return null or throw if user not found for removal', async () => {
        const userId = 'nonexistent-id';

        // Mock prisma.user.update to return null or throw (depending on Prisma behavior when ID not found)
        // Prisma update throws if not found by default, need to handle that or mock to return null.
        // Let's assume it throws for this test.
        jest.spyOn(prisma.user, 'update').mockRejectedValue(new Error('User not found')); // Simulate Prisma throwing

        await expect(service.remove(userId)).rejects.toThrow('User not found'); // Expect the service to handle/rethrow
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: userId },
            data: { deletedAt: expect.any(Date) },
          });
    });
  });

  // Add tests for findAll, update, and findOneByEmail (if applicable)
}); 