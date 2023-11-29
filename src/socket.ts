import { Socket, io } from 'socket.io-client'
import { ServerToClientEvents, ClientToServerEvents } from './types/socket.io'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_CHAT_SERVER_URL,
  {
    autoConnect: false
  }
)

export default socket
