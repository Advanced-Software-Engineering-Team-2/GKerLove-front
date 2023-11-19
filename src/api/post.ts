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

function retrievePosts(page: number) {
  return request.get<R<{ posts: Page<Post> }>>('/post', {
    params: {
      page
    }
  })
}

function getUserPosts(userId: string) {
  return request.get<R<{ posts: Page<Post> }>>(`/post/user/${userId}`)
}

function deletePost(postId: string) {
  return request.delete<R>(`/post/${postId}`)
}

function getPostById(postId: string) {
  return request.get<R<{ post: Post }>>(`/post/${postId}`)
}

function comment(postId: string, content: string) {
  return request.post<R>(`/post/comment/${postId}`, {
    content
  })
}

export default {
  addPost,
  retrievePosts,
  getUserPosts,
  deletePost,
  getPostById,
  comment
}
