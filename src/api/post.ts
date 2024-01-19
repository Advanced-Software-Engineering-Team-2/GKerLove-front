import request from '@/utils/request'

import type { R } from '@/types/R'
import type { Post, Comment } from '@/types/Post'
import type { Page } from '@/types/Page'

function addPost(content: string, imageList: string[], anonymous: boolean) {
  return request.post<R<{ post: Post }>>('/post', {
    content,
    imageList,
    anonymous
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
  return request.get<R<{ post: Post | undefined }>>(`/post/${postId}`)
}

function commentOnPost(postId: string, content: string, anonymous: boolean) {
  return request.post<R<{ comment: Comment }>>(`/post/comment/${postId}`, {
    content,
    anonymous
  })
}

export default {
  addPost,
  retrievePosts,
  getUserPosts,
  deletePost,
  getPostById,
  commentOnPost
}
