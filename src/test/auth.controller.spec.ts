import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'modules/auth/auth.controller';
import { AuthService } from 'modules/auth/auth.service';
import { LoginDto } from 'modules/auth/dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ accessToken: 'token' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should log in and return a JWT token', async () => {
    const dto: LoginDto = { username: 'test', password: 'password' };
    const result = await authController.login(dto);
    expect(result).toEqual({ accessToken: 'token' });
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
