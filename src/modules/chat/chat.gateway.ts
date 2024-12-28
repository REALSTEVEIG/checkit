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

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { chatId: number; senderId: number; content: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.addMessage(
      data.chatId,
      data.senderId,
      data.content,
    );
    this.server.emit(`chat_${data.chatId}`, message);
  }

  @SubscribeMessage('closeChat')
  async handleCloseChat(
    @MessageBody() data: { chatId: number; summary: string },
  ) {
    const chat = await this.chatService.closeChat(data.chatId, data.summary);
    this.server.emit(`chat_closed_${data.chatId}`, chat);
  }
}
