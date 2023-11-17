import request from '@/utils/request'

import type { R } from '@/types/R'
import type { Post } from '@/types/Post'
import type { Page } from '@/types/Page'

function addPost(content: string, imageList: string[]) {
  return request.post<R<{ post: Post }>>('/post', {
    content,
    imageList
  })
}

function getUserPosts(userId: string) {
  return request.get<R<{ posts: Page<Post> }>>(`/post/${userId}`)
}

function deletePost(postId: string) {
  return request.delete<R>(`/post/${postId}`)
}

export default {
  addPost,
  getUserPosts,
  deletePost
}
