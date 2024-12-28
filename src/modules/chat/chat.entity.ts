export class Chat {
  id!: number;
  orderId!: number;
  messages!: ChatMessage[];
  isClosed!: boolean;
  summary?: string;
}

export class ChatMessage {
  id!: number;
  senderId!: number;
  content!: string;
  timestamp!: Date;
}
