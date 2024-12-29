import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SharedModule } from 'shared/services/shared.module';
import { ChatModule } from 'modules/chat/chat.module';

@Module({
  imports: [SharedModule, ChatModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
