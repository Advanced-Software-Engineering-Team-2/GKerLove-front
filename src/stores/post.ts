import type { Post } from '@/types/Post'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import postApi from '@/api/post'
import { showSuccess } from '@/utils/show'
import { useUserStore } from './user'

export const usePostStore = defineStore('post', () => {
  // 动态列表
  const posts = ref<Post[]>([])
  const pageSize = 10
  const page = ref(1)
  const hasFetchedAll = ref(false)

  // 我的动态列表
  const myPosts = ref<Post[]>([])

  // 用户动态列表
  const userPosts = ref<Map<string, Post[]>>(new Map())

  // 获取动态列表
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

  // 清空动态列表
  function clearPosts() {
    page.value = 1
    hasFetchedAll.value = false
  }

  // 获取动态详细信息
  async function fetchPostDetail(postId: string, source: string | null) {
    try {
      const res = await postApi.getPostById(postId)
      const post = res.data.data.post
      if (!post) return undefined
      // 从对应数据源中更新数据
      // 数据源可能是posts（动态列表）, my（我的动态）, user（其它用户的动态）
      if (!source || source === 'posts') {
        const index = posts.value.findIndex((post) => post.id === postId)
        if (index !== -1) {
          Object.assign(posts.value[index], post)
          return posts.value[index]
        }
      } else if (source === 'my') {
        const index = myPosts.value.findIndex((post) => post.id === postId)
        if (index !== -1) {
          Object.assign(myPosts.value[index], post)
          return myPosts.value[index]
        }
      } else if (userPosts.value.has(source)) {
        const index = userPosts.value.get(source)!.findIndex((post) => post.id === postId)
        if (index !== -1) {
          Object.assign(userPosts.value.get(source)![index], post)
          return userPosts.value.get(source)![index]
        }
      }
      return post
    } catch (_) {
      return Promise.reject()
    }
  }

  async function commentOnPost(postId: string, content: string) {
    try {
      const res = await postApi.commentOnPost(postId, content)
      showSuccess(res.data.message)
      return res.data.data.comment
    } catch (_) {
      return Promise.reject()
    }
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

  async function fetchUserPosts(userId: string) {
    try {
      const res = await postApi.getUserPosts(userId)
      userPosts.value.set(userId, res.data.data.posts.content)
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
    fetchPostDetail,
    fetchMyPosts,
    fetchUserPosts,
    addPost,
    deletePost,
    commentOnPost
  }
})
