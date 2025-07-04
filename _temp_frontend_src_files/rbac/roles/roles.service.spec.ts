import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('RolesService', () => {
  let service: RolesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: PrismaService,
          useValue: { // Mock PrismaService methods used by RolesService
            role: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(), // For assigning/removing permissions
            },
            user: {
              update: jest.fn(), // For assigning/removing roles to users
            },
            $transaction: jest.fn(x => x()), // Mock $transaction to just execute the callback
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto = { name: 'editor' };
      const createdRole = { id: 'role-id', name: 'editor' };

      jest.spyOn(prisma.role, 'create').mockResolvedValue(createdRole as any);

      const result = await service.create(createRoleDto as any);

      expect(result).toEqual(createdRole);
      expect(prisma.role.create).toHaveBeenCalledWith({ data: createRoleDto });
    });

    it('should throw if role name already exists', async () => {
      const createRoleDto = { name: 'admin' };
      
      // Simulate Prisma throwing a unique constraint error
      jest.spyOn(prisma.role, 'create').mockRejectedValue(new Error('Unique constraint failed'));

      await expect(service.create(createRoleDto as any)).rejects.toThrow();
      expect(prisma.role.create).toHaveBeenCalledWith({ data: createRoleDto });
    });
  });

  describe('findOne', () => {
    it('should return a role by ID', async () => {
      const roleId = 'role-id';
      const mockRole = { id: roleId, name: 'editor' };

      jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(mockRole as any);

      const result = await service.findOne(roleId);

      expect(result).toEqual(mockRole);
      expect(prisma.role.findUnique).toHaveBeenCalledWith({ where: { id: roleId }, include: expect.anything() }); // Assuming include is used
    });

    it('should return null if role not found', async () => {
      const roleId = 'nonexistent-id';

      jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(null);

      const result = await service.findOne(roleId);

      expect(result).toBeNull();
      expect(prisma.role.findUnique).toHaveBeenCalledWith({ where: { id: roleId }, include: expect.anything() });
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign a role to a user', async () => {
      const userId = 'user-id';
      const roleId = 'role-id';
      const updatedUser = { id: userId, roleId: roleId };

      jest.spyOn(prisma.user, 'update').mockResolvedValue(updatedUser as any);

      const result = await service.assignRoleToUser(userId, roleId);

      expect(result).toEqual(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { roleId: roleId },
      });
    });

    it('should throw if user not found', async () => {
        const userId = 'nonexistent-user';
        const roleId = 'role-id';

        jest.spyOn(prisma.user, 'update').mockRejectedValue(new Error('User not found'));

        await expect(service.assignRoleToUser(userId, roleId)).rejects.toThrow('User not found');
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { id: userId },
          data: { roleId: roleId },
        });
    });

    // Add tests for removeRoleFromUser, assignPermissionsToRole, removePermissionsFromRole
  });

  // Add tests for findAll, update, remove
}); 