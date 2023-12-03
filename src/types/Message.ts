export type messageType = 'text' | 'image' | 'disappearing'

export interface Message {
  _id: string
  timestamp: string
  type: messageType
  senderId: string
  recipientId: string
  content: string
  viewed?: boolean
}
