import { ClientToServerEvents, ServerToClientEvents } from './types/socket.io'
import { Socket, io } from 'socket.io-client'

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined = undefined

function connectChatServer(token: string) {
  socket = io(import.meta.env.VITE_CHAT_SERVER_URL, {
    auth: { token }
  })
}

function disconnectChatServer() {
  socket?.disconnect()
}

export { socket, connectChatServer, disconnectChatServer }
