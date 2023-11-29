import { Message } from '@/types/Message'
import { User } from './User'

export interface Session {
  id: string
  initiator: User
  recipient: User
  lastUpdated: Date
  initiatorLastRead?: Date
  recipientLastRead?: Date
  messages: Message[]
}
