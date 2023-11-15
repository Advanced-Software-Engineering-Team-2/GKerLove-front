import request from '@/utils/request'

import type { R } from '@/types/R'
import type { Post } from '@/types/Post'

function addPost(post: Post) {
  return request.post<R>('/post', post)
}

export default {
  addPost
}
