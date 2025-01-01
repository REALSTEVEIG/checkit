import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from 'modules/chat/chat.controller';
import { ChatService } from 'modules/chat/chat.service';

describe('ChatController', () => {
  let chatController: ChatController;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            addMessage: jest
              .fn()
              .mockResolvedValue({ id: 1, content: 'Hello' }),
            getMessages: jest
              .fn()
              .mockResolvedValue([{ id: 1, content: 'Hello' }]),
          },
        },
      ],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should send a message', async () => {
    const data = { chatRoomId: 1, senderId: 1, content: 'Hello' };
    const result = await chatController.sendMessage(data);
    expect(result).toEqual({ id: 1, content: 'Hello' });
    expect(chatService.addMessage).toHaveBeenCalledWith(1, 1, 'Hello');
  });

  it('should get messages from a chat room', async () => {
    const result = await chatController.getMessages(1);
    expect(result).toEqual([{ id: 1, content: 'Hello' }]);
    expect(chatService.getMessages).toHaveBeenCalledWith(1);
  });
});
