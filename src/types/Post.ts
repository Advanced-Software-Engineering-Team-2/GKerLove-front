import { User } from './User'

export interface Post {
  id: string
  user: User
  content: string
  imageList: string[]
  time: string
  commentList: Comment[]
}

export interface Comment {
  user: User
  content: string
  time: string
}
