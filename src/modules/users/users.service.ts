import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'shared/services/prisma.services';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findByUsername(username: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { username } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error: any) {
      throw new HttpException(
        `Error finding user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(data: any) {
    try {
      return await this.prisma.user.create({ data });
    } catch (error: any) {
      throw new HttpException(
        `Error creating user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(user: any) {
    try {
      const payload = {
        username: user.username,
        sub: user.id,
        role: user.role,
      };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error: any) {
      throw new HttpException(
        `Error during login: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
