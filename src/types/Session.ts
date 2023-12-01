import { Message } from '@/types/Message'
import { User } from './User'

export interface Session {
  id: string
  peer: User
  messages: Message[]
  lastRead?: string
  peerLastRead?: string
}
