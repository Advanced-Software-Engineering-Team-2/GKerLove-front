interface BaseMessage {
  id: number
  authorId: string
  timestamp: string
}

export interface TextMessage extends BaseMessage {
  type: 'text'
  text: string
}

export interface ImageMessage extends BaseMessage {
  type: 'image'
  url: string
}

export interface TypingMessage extends BaseMessage {
  type: 'typing'
}

export type Message = TextMessage | ImageMessage | TypingMessage
