import { Injectable, Inject, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
  
  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    try {
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    } catch (error) {
      throw new HttpException(`'Error generating JWT token '${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
