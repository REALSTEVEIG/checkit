import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'modules/users/users.controller';
import { UsersService } from 'modules/users/users.service';
import { RegisterUserDto } from 'modules/users/dto/register-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest
              .fn()
              .mockResolvedValue({ id: 1, username: 'test' }),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should register a new user', async () => {
    const dto: RegisterUserDto = {
      username: 'test',
      password: 'password',
      email: 'test@gmail.com',
    };
    const result = await usersController.registerUser(dto);
    expect(result).toEqual({ id: 1, username: 'test' });
    expect(usersService.createUser).toHaveBeenCalledWith({
      username: 'test',
      password: expect.any(String),
    });
  });
});
