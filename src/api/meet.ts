import request from '@/utils/request'
import type { R } from '@/types/R'
import type { User } from '@/types/User'

function getUserList(
  gender?: string,
  minAge?: number,
  maxAge?: number,
  city?: string,
  institute?: string
) {
  return request.get<R<{ userList: User[] }>>('/meet', {
    params: {
      gender: gender,
      minAge: minAge,
      maxAge: maxAge,
      city: city,
      institute: institute
    }
  })
}

function addlove(fromusername: string, tousername: string) {
  return request.post<R>('/meet/addlove', null, {
    params: {
      fromusername: fromusername,
      tousername: tousername
    }
  })
}
function notlove(fromusername: string, tousername: string) {
  return request.post<R>('/meet/notlove', null, {
    params: {
      fromusername: fromusername,
      tousername: tousername
    }
  })
}

function getUserById(id: string) {
  return request.get<R<{ user: User }>>(`/meet/${id}`)
}

export default {
  getUserList,
  addlove,
  notlove,
  getUserById
}
