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
  async handleJoinChat(
    @MessageBody() data: { orderId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const chatRoom = await this.chatService.getChatRoomByOrderId(data.orderId);

    if (!chatRoom) {
      client.emit('error', { message: 'Chat room not found for this order.' });
      return;
    }

    // Authorization check: Only allow access if the user is an admin or owns the order
    const { userId, role } = client.handshake.auth;
    if (role !== 'ADMIN' && chatRoom.order.userId !== userId) {
      client.emit('error', {
        message: 'Unauthorized access to this chat room.',
      });
      return;
    }

    // Join the room based on the found chatRoomId
    client.join(`chat_${chatRoom.id}`);
    client.emit('joinedChat', { chatRoomId: chatRoom.id });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: { chatRoomId: number; senderId: number; content: string },
    @ConnectedSocket() _client: Socket,
  ) {
    console.log('data', data);
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
