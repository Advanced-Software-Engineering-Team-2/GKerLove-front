import request from '@/utils/request'

import type { R } from '@/types/R'
import type { Post } from '@/types/Post'
import type { Page } from '@/types/Page'

function addPost(content: string, imageList: string[]) {
  return request.post<R>('/post', {
    content,
    imageList
  })
}

function getMyPosts(pageNumber: number) {
  return request.get<R<{ postList: Page<Post> }>>('/post/my', {
    params: {
      pageNumber
    }
  })
}

export default {
  addPost,
  getMyPosts
}
