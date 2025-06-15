import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const mockAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: { // Mock RolesService methods
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            assignRoleToUser: jest.fn(),
            removeRoleFromUser: jest.fn(),
            assignPermissionsToRole: jest.fn(),
            removePermissionsFromRole: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockAuthGuard)
    .overrideGuard(RolesGuard)
    .useValue(mockRolesGuard)
    .compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call RolesService.create', async () => {
      const createRoleDto = { name: 'test-role' };
      const expectedResult = { id: 'role-id', ...createRoleDto };
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(createRoleDto as any);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('findAll', () => {
    it('should call RolesService.findAll', async () => {
      const expectedResult = [{ id: 'role1', name: 'admin' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult as any);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call RolesService.findOne', async () => {
      const roleId = 'role-id';
      const expectedResult = { id: roleId, name: 'editor' };
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult as any);

      const result = await controller.findOne(roleId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(roleId);
    });
  });

  describe('update', () => {
    it('should call RolesService.update', async () => {
      const roleId = 'role-id';
      const updateRoleDto = { name: 'updated-role' };
      const expectedResult = { id: roleId, ...updateRoleDto };
      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      const result = await controller.update(roleId, updateRoleDto as any);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(roleId, updateRoleDto);
    });
  });

  describe('remove', () => {
    it('should call RolesService.remove', async () => {
      const roleId = 'role-id';
      const expectedResult = { id: roleId, name: 'deleted-role' };
      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult as any);

      const result = await controller.remove(roleId);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(roleId);
    });
  });

  describe('assignRoleToUser', () => {
    it('should call RolesService.assignRoleToUser', async () => {
      const userId = 'user-id';
      const roleId = 'role-id';
      const expectedResult = { id: userId, roleId: roleId };
      jest.spyOn(service, 'assignRoleToUser').mockResolvedValue(expectedResult as any);

      const result = await controller.assignRoleToUser({ userId, roleId } as any);

      expect(result).toEqual(expectedResult);
      expect(service.assignRoleToUser).toHaveBeenCalledWith(userId, roleId);
    });
  });

  describe('removeRoleFromUser', () => {
    it('should call RolesService.removeRoleFromUser', async () => {
      const userId = 'user-id';
      const roleId = 'role-id';
      const expectedResult = { id: userId, roleId: null };
      jest.spyOn(service, 'removeRoleFromUser').mockResolvedValue(expectedResult as any);

      const result = await controller.removeRoleFromUser({ userId, roleId } as any);

      expect(result).toEqual(expectedResult);
      expect(service.removeRoleFromUser).toHaveBeenCalledWith(userId, roleId);
    });
  });

  // Add tests for assignPermissionsToRole and removePermissionsFromRole
}); 