import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'shared/guards/jwt-auth.guard';
import { RolesGuard } from 'shared/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Post('message')
  async sendMessage(
    @Body() data: { chatRoomId: number; senderId: number; content: string },
  ) {
    try {
      return await this.chatService.addMessage(
        data.chatRoomId,
        data.senderId,
        data.content,
      );
    } catch (error: any) {
      console.error('Error sending message:', error.message);
      throw new HttpException(
        error.message || 'Failed to send message',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/messages')
  async getMessages(@Param('id') chatRoomId: number) {
    return this.chatService.getMessages(chatRoomId);
  }

  @Patch(':id/close')
  @UseGuards(RolesGuard)
  async closeChatRoom(
    @Param('id') chatRoomId: number,
    @Body('summary') summary: string,
  ) {
    return this.chatService.closeChat(chatRoomId, summary);
  }
}
