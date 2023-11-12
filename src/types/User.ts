export interface UserInfo {
  avatar?: string
  gender?: '男' | '女'
  age?: number
  city?: string
  institute?: string
  introduction?: string
}

export interface User {
  username: string
  email: string
  info: UserInfo
}
