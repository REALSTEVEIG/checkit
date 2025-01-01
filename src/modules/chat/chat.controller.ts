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
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@shared/decorators/roles.decorator';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Send a message in a chat room' })
  @ApiResponse({ status: 201, description: 'Message sent successfully.' })
  @ApiResponse({ status: 404, description: 'Chat room not found.' })
  @ApiResponse({ status: 400, description: 'Chat room is closed.' })
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
      throw new HttpException(
        error.message || 'Failed to send message',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/messages')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Get all messages in a chat room' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Chat room not found.' })
  async getMessages(@Param('id') chatRoomId: number) {
    return this.chatService.getMessages(chatRoomId);
  }

  @Patch(':id/close')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Close a chat room (Admin only)' })
  @ApiResponse({ status: 200, description: 'Chat room closed successfully.' })
  @ApiResponse({ status: 404, description: 'Chat room not found.' })
  async closeChatRoom(
    @Param('id') chatRoomId: number,
    @Body('summary') summary: string,
  ) {
    return this.chatService.closeChat(chatRoomId, summary);
  }

  @Get('active-rooms')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Get all active chat rooms (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Chat rooms retrieved successfully.',
  })
  async getActiveChatRooms() {
    return this.chatService.getActiveChatRooms();
  }
}
