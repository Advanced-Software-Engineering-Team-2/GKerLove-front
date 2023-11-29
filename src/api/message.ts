import request from '@/utils/request'
import type { R } from '@/types/R'
import { Session } from '@/types/Session'

function getSessions() {
  return request.get<R<{ sessions: Session[] }>>('/message')
}

function createSession(recipientId: string) {
  return request.post<R<{ session: Session }>>(`/message/${recipientId}`)
}

export default {
  getSessions,
  createSession
}
