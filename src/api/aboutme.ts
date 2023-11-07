import request from '@/utils/request'
import type { R } from '@/types/R'
import type { Aboutme } from '@/types/Aboutme'

function setabout(  username: string,
                    nickname: string,
                    avatar: string,
                    gender: string,
                    age: string,
                    city: string,
                    institute: string,
                    major: string,
                    introduction: string) {
  return request.post<R<null>>('/about/setabout',{ username, nickname, avatar, gender, age, city, institute, major, introduction })
}



function getabout(username: string) {
  return request.get<R<{ about: Aboutme }>>('/about/getabout',{ params: { username } })
}

export default {
  setabout,
  getabout
}
