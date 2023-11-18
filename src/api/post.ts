import request from '@/utils/request'

import type { R } from '@/types/R'
import type { Post, Comment } from '@/types/Post'
import type { Page } from '@/types/Page'

function addPost(content: string, imageList: string[]) {
  return request.post<R<{ post: Post }>>('/post', {
    content,
    imageList
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

function comment(content: string, postId: string) {
  return request.post<R<{ comment: Comment }>>(`/post/comment/${postId}`, {
    content
  })
}

export default {
  addPost,
  getUserPosts,
  deletePost,
  getPostById,
  comment
}
