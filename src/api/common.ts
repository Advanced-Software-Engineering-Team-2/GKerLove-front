import request from '@/utils/request'
import type { R } from '@/types/R'

function sendCode(email: string) {
  return request.get<R<null>>('/common/code', {
    params: { email }
  })
}

export default {
  sendCode
}
