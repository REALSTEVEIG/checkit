import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { SharedModule } from '../../shared/services/shared.module';

@Module({
  imports: [SharedModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
