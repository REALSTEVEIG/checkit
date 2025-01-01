import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersService } from './users.service';
import { SharedModule } from '@shared/services/shared.module';
import { UsersController } from './users.controller';

@Module({
  imports: [SharedModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
