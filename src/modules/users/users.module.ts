import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { SharedModule } from '../../shared/services/shared.module';

@Module({
  imports: [SharedModule, JwtModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}