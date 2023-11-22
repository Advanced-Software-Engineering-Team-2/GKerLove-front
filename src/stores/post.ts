import type { Post } from '@/types/Post'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import postApi from '@/api/post'
import { showSuccess } from '@/utils/show'
import { useUserStore } from './user'
import { User } from '@/types/User'

export const usePostStore = defineStore('post', () => {
  const myPosts = ref<Post[]>([])
  const posts = ref<Post[]>([])
  const userPosts = ref<Record<string, Post[]>>({})
  const pageSize = 10
  const page = ref(1)
  const hasFetchedAll = ref(false)

  async function fetchPosts() {
    try {
      const res = await postApi.retrievePosts(page.value)
      const newPosts = res.data.data.posts.content
      if (page.value === 1) posts.value = newPosts
      else posts.value.push(...newPosts)
      hasFetchedAll.value = res.data.data.posts.total <= pageSize * page.value
      page.value++
    } catch (_) {
      return Promise.reject()
    }
  }

  async function syncPost(post: Post) {
    try {
      const id = post.id
      const res = await postApi.getPostById(id)
      if (res.data.data.post === null) {
        posts.value = posts.value.filter((post) => post.id !== id)
        return Promise.reject()
      }
      // 更新帖子信息
      Object.assign(post, res.data.data.post)
    } catch (_) {
      return Promise.reject()
    }
  }

  async function commentOnPost(post: Post, content: string) {
    try {
      const res = await postApi.commentOnPost(post.id, content)
      showSuccess(res.data.message)
    } catch (_) {
      return Promise.reject()
    }
  }

  function clearPosts() {
    page.value = 1
    hasFetchedAll.value = false
  }

  async function fetchMyPosts() {
    const user = useUserStore()
    try {
      const res = await postApi.getUserPosts(user.id!)
      myPosts.value = res.data.data.posts.content
    } catch (_) {
      return Promise.reject()
    }
  }

  async function fetchUserPosts(user: User) {
    try {
      const res = await postApi.getUserPosts(user.id)
      userPosts.value[user.id] = res.data.data.posts.content
    } catch (_) {
      return Promise.reject()
    }
  }

  async function addPost(content: string, imageIds: string[]) {
    try {
      const res = await postApi.addPost(content, imageIds)
      const post = res.data.data.post
      myPosts.value.unshift(post)
      showSuccess(res.data.message)
    } catch (_) {
      return Promise.reject()
    }
  }

  async function deletePost(id: string) {
    try {
      const res = await postApi.deletePost(id)
      myPosts.value = myPosts.value.filter((post) => post.id !== id)
      showSuccess(res.data.message)
    } catch (_) {
      return Promise.reject()
    }
  }

  return {
    myPosts,
    posts,
    page,
    hasFetchedAll,
    userPosts,
    fetchPosts,
    clearPosts,
    syncPost,
    fetchMyPosts,
    fetchUserPosts,
    addPost,
    deletePost,
    commentOnPost
  }
})
