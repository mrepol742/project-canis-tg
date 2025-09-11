export interface Message {
  body: string,
  reply: (content: string) => Promise<Message>
}
