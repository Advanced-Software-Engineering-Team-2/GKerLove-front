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

function likeSomeone(userId: string) {
  return request.post<R>(`/meet/like/${userId}`)
}

function dislikeSomeone(userId: string) {
  return request.post<R>(`/meet/dislike/${userId}`)
}

function getUserById(id: string) {
  return request.get<R<{ user: User }>>(`/meet/${id}`)
}

function getMyLikes() {
  return request.get<R<{ likes: User[] }>>(`/meet/likes`)
}

function getWhoLikeMe() {
  return request.get<R<{ likedBy: User[] }>>(`/meet/likedBy`)
}

export default {
  getUserList,
  likeSomeone,
  dislikeSomeone,
  getUserById,
  getMyLikes,
  getWhoLikeMe
}
