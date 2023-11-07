import request from '@/utils/request'
import type { R } from '@/types/R'
import type { UserInfo } from '@/types/User'

function login(username: string, password: string, captcha: string) {
  return request.post<R<{ token: string }>>(
    '/user/login',
    { username, password },
    { params: { captcha } }
  )
}

function register(
  username: string,
  password: string,
  email: string,
  captcha: string,
  code: string
) {
  return request.post<R<null>>(
    '/user/register',
    {
      username: username,
      password: password,
      email: email,
      hasaboutme: false
    },
    {
      params: {
        captcha,
        code
      }
    }
  )
}

function getInfo() {
  return request.get<R<{ user: UserInfo }>>('/user/info')
}

export default {
  login,
  register,
  getInfo
}
