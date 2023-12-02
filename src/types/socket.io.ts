import { Message } from '@/types/Message'

interface SockeIoMessage {
  sessionId: string
  message: Message
}

interface ServerToClientEvents {
  messages: (messages: Message[]) => void
  privateMessage: (message: SockeIoMessage) => void
  startTyping: (sessionId: string) => void
  stopTyping: (sessionId: string) => void
}

interface ClientToServerEvents {
  privateMessage: (message: Message, callback: (message: SockeIoMessage) => void) => void
  readMessages: (sessionId: string) => void
  startTyping: (sessionId: string) => void
  stopTyping: (sessionId: string) => void
}
export { ServerToClientEvents, ClientToServerEvents, SockeIoMessage }
