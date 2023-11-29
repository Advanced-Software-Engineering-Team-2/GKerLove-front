import { Message } from '@/types/Message'

interface SockeIoMessage {
  id: string
  timestamp: Date
  type: 'text' | 'image'
  sender_id: string
  recipient_id: string
  content: string
}

interface ServerToClientEvents {
  messages: (messages: Message[]) => void
  privateMessage: (message: SockeIoMessage) => void
}

interface ClientToServerEvents {
  privateMessage: (
    content: string,
    recipientId: string,
    type: 'text' | 'image',
    callback: (message: SockeIoMessage) => void
  ) => void
  readMessages: (sessionId: string) => void
}
export { ServerToClientEvents, ClientToServerEvents, SockeIoMessage }
