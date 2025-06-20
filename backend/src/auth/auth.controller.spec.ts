import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard if used by the controller

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthGuard = { // Mock any guards used by the controller, like JwtAuthGuard
    canActivate: jest.fn((context) => {
      const request = context.switchToHttp().getRequest();
      // Simulate attaching a user to the request if needed for guarded routes
      request.user = { userId: 'test-user-id', username: 'test@example.com' }; // Mock user payload
      return true; // Always allow in this mock
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { // Mock AuthService methods used by the controller
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    })
    // Override any guards applied at the controller or method level
    .overrideGuard(AuthGuard('jwt')) // Replace with your actual JwtAuthGuard if named differently
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { access_token: 'mock-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult as any);

      const result = await controller.login(loginDto as any);

      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    // Add test cases for invalid input or service errors
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
        const registerDto = { email: 'new@example.com', password: 'newpassword' };
        const expectedResult = { id: 'new-user-id', email: 'new@example.com' };

        jest.spyOn(authService, 'register').mockResolvedValue(expectedResult as any);

        const result = await controller.register(registerDto as any);

        expect(result).toEqual(expectedResult);
        expect(authService.register).toHaveBeenCalledWith(registerDto);
      });

      // Add test cases for invalid input or service errors (e.g., email already exists)
  });

  // If you have a protected endpoint like /auth/profile
  // describe('getProfile', () => {
  //   it('should return the user object from the request', async () => {
  //     const mockUser = { userId: 'test-user-id', username: 'test@example.com' };

  //     // The mockAuthGuard attaches the user to the request, so we just need to ensure
  //     // the controller method correctly accesses req.user.
  //     // If testing a method like `getProfile(@Request() req)`, you would pass the mockRequest here.
  //     // Assuming a typical pattern where the guard populates req.user and the controller uses it directly:

  //     // Since we are unit testing the controller, we can directly pass a mock request object
  //     // to the method if it expects one.
  //     // Example if the method signature is `getProfile(@Request() req)`:
  //     // const mockRequestWithUser = { user: mockUser };
  //     // const result = await controller.getProfile(mockRequestWithUser as any);
  //     // expect(result).toEqual(mockUser);

  //     // If the controller method uses a decorator like @User() to get the user:
  //     // This requires more advanced testing setup to mock the decorator/param decorator.
  //     // For simplicity in initial tests, focus on methods interacting with services.
  //   });
  // });
}); 