import { User } from './User'

export interface Post {
  id: string
  user: User
  content: string
  imageList: string[]
  time: string
  commentCnt: number
  commentList: Comment[]
}

export interface Comment {
  id: string
  user: User
  content: string
  time: string
}
