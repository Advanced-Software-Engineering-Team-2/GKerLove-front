export interface Message {
  id: string
  timestamp: string
  type: 'text' | 'image'
  senderId: string
  recipientId: string
  content: string
}
