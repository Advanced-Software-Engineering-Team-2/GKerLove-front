import type { Post } from '@/types/Post'

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import postApi from '@/api/post'
import { showSuccess } from '@/utils/show'
import { useUserStore } from './user'

export const usePostStore = defineStore('post', () => {
  const myPosts = ref<Post[]>([])
  const posts = ref<Post[]>([])
  const pageSize = 10
  const page = ref(1)
  const hasFetchedAll = ref(false)
  const getPostById = computed(() => {
    return (id: string) => posts.value.find((post) => post.id === id)
  })

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

  async function fetchPostById(id: string) {
    try {
      const postInStore = posts.value.find((post) => post.id === id)
      if (!postInStore) return undefined
      const res = await postApi.getPostById(id)
      const synced_post = res.data.data.post
      // 更新帖子信息
      Object.assign(postInStore, synced_post)
    } catch (_) {
      return Promise.reject()
    }
  }

  async function commentOnPost(post: Post, content: string) {
    try {
      const res = await postApi.comment(post.id, content)
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
      posts.value = res.data.data.posts.content
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
      posts.value = posts.value.filter((post) => post.id !== id)
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
    getPostById,
    fetchPosts,
    clearPosts,
    fetchPostById,
    fetchMyPosts,
    addPost,
    deletePost,
    commentOnPost
  }
})
