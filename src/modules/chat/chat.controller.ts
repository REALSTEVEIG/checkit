import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(
    @Body() data: { chatRoomId: number; senderId: number; content: string },
  ) {
    return this.chatService.addMessage(
      data.chatRoomId,
      data.senderId,
      data.content,
    );
  }

  @Get(':id/messages')
  async getMessages(@Param('id') chatRoomId: number) {
    return this.chatService.getMessages(chatRoomId);
  }

  @Patch(':id/close')
  async closeChatRoom(
    @Param('id') chatRoomId: number,
    @Body('summary') summary: string,
  ) {
    return this.chatService.closeChat(chatRoomId, summary);
  }
}
