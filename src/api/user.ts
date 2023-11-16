import request from '@/utils/request'
import type { R } from '@/types/R'
import type { User, UserInfo } from '@/types/User'

function login(username: string, password: string, captcha: string) {
  return request.post<R<{ token: string }>>('/user/login', { username, password, captcha })
}

function register(
  username: string,
  password: string,
  email: string,
  captcha: string,
  code: string
) {
  return request.post<R>('/user/register', {
    username,
    password,
    email,
    captcha,
    code
  })
}

function getUser() {
  return request.get<R<{ user: User }>>('/user/info')
}

function updateInfo(userInfo: UserInfo) {
  return request.put<R<{ info: UserInfo }>>('/user/info', userInfo)
}

export default {
  login,
  register,
  updateInfo,
  getUser
}
