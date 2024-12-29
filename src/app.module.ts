import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [AuthModule, UsersModule, OrdersModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
