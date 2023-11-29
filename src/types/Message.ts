export interface Message {
  id: string
  timestamp: Date
  type: 'text' | 'image'
  senderId: string
  recipientId: string
  content: string
}
