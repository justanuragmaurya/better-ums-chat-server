export interface ChatMessage {
    message: string;
    from: {
      name: string;
      id: string;
    };
}