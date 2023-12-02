export interface Message {
  id: string
  timestamp: string
  type: 'text' | 'image' | 'disappearing'
  senderId: string
  recipientId: string
  content: string
}
