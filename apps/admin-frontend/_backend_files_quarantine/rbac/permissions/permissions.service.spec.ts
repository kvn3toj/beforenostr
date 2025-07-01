import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PrismaService,
          useValue: { // Mock PrismaService methods used by PermissionsService
            permission: {
              findUnique: jest.fn(),
              create: jest.fn(),
              // Add other methods as needed (findMany, update, delete)
            },
            $transaction: jest.fn(x => x()), // Mock $transaction if used
          },
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionDto = { name: 'read:users' };
      const createdPermission = { id: 'perm-id', name: 'read:users' };

      jest.spyOn(prisma.permission, 'create').mockResolvedValue(createdPermission as any);

      const result = await service.create(createPermissionDto as any);

      expect(result).toEqual(createdPermission);
      expect(prisma.permission.create).toHaveBeenCalledWith({ data: createPermissionDto });
    });

    it('should throw if permission name already exists', async () => {
        const createPermissionDto = { name: 'create:users' };
        
        // Simulate Prisma throwing a unique constraint error
        jest.spyOn(prisma.permission, 'create').mockRejectedValue(new Error('Unique constraint failed'));
  
        await expect(service.create(createPermissionDto as any)).rejects.toThrow();
        expect(prisma.permission.create).toHaveBeenCalledWith({ data: createPermissionDto });
      });
  });

  describe('findOne', () => {
    it('should return a permission by ID', async () => {
      const permId = 'perm-id';
      const mockPermission = { id: permId, name: 'read:users' };

      jest.spyOn(prisma.permission, 'findUnique').mockResolvedValue(mockPermission as any);

      const result = await service.findOne(permId);

      expect(result).toEqual(mockPermission);
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({ where: { id: permId } });
    });

    it('should return null if permission not found', async () => {
      const permId = 'nonexistent-id';

      jest.spyOn(prisma.permission, 'findUnique').mockResolvedValue(null);

      const result = await service.findOne(permId);

      expect(result).toBeNull();
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({ where: { id: permId } });
    });
  });

  // Add tests for findAll, update, remove, findByName
}); 