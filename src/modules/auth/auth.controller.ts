import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: { username: string; password: string }) {
    return this.authService.login(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test-auth')
  async testAuth(@Request() req: ExpressRequest) {
    return req.user;
  }
}
