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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
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
    @ConnectedSocket() client: Socket,
  ) {
    const { role } = client.handshake.auth;
    if (role !== 'ADMIN') {
      client.emit('error', {
        message: 'Access Denied: Only Admins can close chats.',
      });
      return;
    }

    const chat = await this.chatService.closeChat(
      data.chatRoomId,
      data.summary,
    );
    this.server.to(`chat_${data.chatRoomId}`).emit('chatClosed', chat);
  }

  @SubscribeMessage('getActiveChatRooms')
  async handleGetActiveChatRooms(@ConnectedSocket() client: Socket) {
    const { role } = client.handshake.auth;
    if (role !== 'ADMIN') {
      client.emit('error', {
        message: 'Access Denied: Only Admins can access active chat rooms.',
      });
      return;
    }

    const activeRooms = await this.chatService.getActiveChatRooms();
    client.emit('activeChatRooms', activeRooms);
  }
}
