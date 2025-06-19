import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Assuming this guard is used
import { RolesGuard } from '../guards/roles.guard'; // Assuming this guard is used
import { PermissionsGuard } from '../guards/permissions.guard'; // Assuming this guard is used

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;

  const mockAuthGuard = { canActivate: jest.fn(() => true) }; // Mock JwtAuthGuard
  const mockRolesGuard = { canActivate: jest.fn(() => true) }; // Mock RolesGuard
  const mockPermissionsGuard = { canActivate: jest.fn(() => true) }; // Mock PermissionsGuard

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: { // Mock PermissionsService methods
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            assignPermissionsToRole: jest.fn(),
            removePermissionsFromRole: jest.fn(),
          },
        },
      ],
    })
    // Override guards applied to the controller or methods
    .overrideGuard(JwtAuthGuard) // Replace with actual guard classes
    .useValue(mockAuthGuard)
    .overrideGuard(RolesGuard)
    .useValue(mockRolesGuard)
    .overrideGuard(PermissionsGuard)
    .useValue(mockPermissionsGuard)
    .compile();

    controller = module.get<PermissionsController>(PermissionsController);
    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call PermissionsService.create with the correct DTO', async () => {
      const createPermissionDto = { name: 'test:permission' };
      const expectedResult = { id: 'perm-id', ...createPermissionDto };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(createPermissionDto as any);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createPermissionDto);
    });
  });

  describe('findAll', () => {
    it('should call PermissionsService.findAll', async () => {
      const expectedResult = [{ id: 'perm1', name: 'read:all' }];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult as any);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call PermissionsService.findOne with the correct ID', async () => {
      const permId = 'perm-id';
      const expectedResult = { id: permId, name: 'read:users' };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult as any);

      const result = await controller.findOne(permId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(permId);
    });
  });

  describe('update', () => {
    it('should call PermissionsService.update with the correct ID and DTO', async () => {
      const permId = 'perm-id';
      const updatePermissionDto = { name: 'updated:permission' };
      const expectedResult = { id: permId, ...updatePermissionDto };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      const result = await controller.update(permId, updatePermissionDto as any);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(permId, updatePermissionDto);
    });
  });

  describe('remove', () => {
    it('should call PermissionsService.remove with the correct ID', async () => {
      const permId = 'perm-id';
      const expectedResult = { id: permId, name: 'deleted:permission' };

      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult as any);

      const result = await controller.remove(permId);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(permId);
    });
  });

  describe('assignPermissionsToRole', () => {
    it('should call PermissionsService.assignPermissionsToRole', async () => {
        const roleId = 'role-id';
        const assignPermissionDto = { permissionIds: ['perm1', 'perm2'] };
        const expectedResult = { id: roleId, permissions: assignPermissionDto.permissionIds };

        jest.spyOn(service, 'assignPermissionsToRole').mockResolvedValue(expectedResult as any);

        const result = await controller.assignPermissionsToRole(roleId, assignPermissionDto as any);

        expect(result).toEqual(expectedResult);
        expect(service.assignPermissionsToRole).toHaveBeenCalledWith(roleId, assignPermissionDto.permissionIds);
    });
  });

  describe('removePermissionsFromRole', () => {
    it('should call PermissionsService.removePermissionsFromRole', async () => {
        const roleId = 'role-id';
        const removePermissionDto = { permissionIds: ['perm1'] };
        const expectedResult = { id: roleId, permissions: [] };

        jest.spyOn(service, 'removePermissionsFromRole').mockResolvedValue(expectedResult as any);

        const result = await controller.removePermissionsFromRole(roleId, removePermissionDto as any);

        expect(result).toEqual(expectedResult);
        expect(service.removePermissionsFromRole).toHaveBeenCalledWith(roleId, removePermissionDto.permissionIds);
    });
  });

}); 