import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'modules/auth/auth.module';
import { UsersService } from './users.service';
import { SharedModule } from '../../shared/services/shared.module';

@Module({
  imports: [SharedModule, forwardRef(() => AuthModule)],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
