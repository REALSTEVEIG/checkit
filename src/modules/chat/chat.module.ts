import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { SharedModule } from 'shared/services/shared.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [SharedModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
