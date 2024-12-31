/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`chat_${data.chatRoomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: { chatRoomId: number; senderId: number; content: string },
    @ConnectedSocket() _client: Socket,
  ) {
    const message = await this.chatService.addMessage(
      data.chatRoomId,
      data.senderId,
      data.content,
    );
    this.server.to(`chat_${data.chatRoomId}`).emit('newMessage', message);
  }

  @SubscribeMessage('closeChat')
  async handleCloseChat(
    @MessageBody() data: { chatRoomId: number; summary: string },
    @ConnectedSocket() _client: Socket,
  ) {
    const chat = await this.chatService.closeChat(
      data.chatRoomId,
      data.summary,
    );
    this.server.to(`chat_${data.chatRoomId}`).emit('chatClosed', chat);
  }
}
