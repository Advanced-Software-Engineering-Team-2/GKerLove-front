import { UserInfo } from '@/types/User'
import { Post } from '@/types/Post'

import { ref } from 'vue'
import { defineStore } from 'pinia'
import OSS from 'ali-oss'
import { createOSSUtil } from '@/utils/OSS'
import { getToken, setToken, removeToken } from '@/utils/auth'
import userApi from '@/api/user'
import postApi from '@/api/post'
import { showSuccess, showError } from '@/utils/show'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const id = ref<string>()
  const username = ref<string>()
  const email = ref<string>()
  const avatar = ref<string>()
  const gender = ref<'男' | '女'>()
  const age = ref<number>()
  const city = ref<string>()
  const institute = ref<string>()
  const introduction = ref<string>()
  const likedByUserIdList = ref<string[]>([])
  const likesUserIdList = ref<string[]>([])
  const posts = ref<Post[]>([])
  const OSSUtil = ref<OSS | null>(null)

  async function initUser() {
    if (!token.value) return null
    try {
      const res = await userApi.getUser()
      const user = res.data.data.user
      id.value = user.id
      username.value = user.username
      email.value = user.email
      avatar.value = user.avatar
      gender.value = user.gender
      age.value = user.age
      city.value = user.city
      institute.value = user.institute
      introduction.value = user.introduction
      likedByUserIdList.value = user.likedByUserIdList
      likesUserIdList.value = user.likesUserIdList
      if (OSSUtil.value === null) {
        OSSUtil.value = await createOSSUtil()
      }
    } catch (_) {
      showError('初始化用户失败')
    }
  }

  async function login(username: string, password: string, captcha: string) {
    try {
      const res = await userApi.login(username, password, captcha)
      token.value = res.data.data.token
      setToken(token.value)
      showSuccess(res.data.message)
    } catch (_) {
      return Promise.reject()
    }
    await initUser()
  }

  async function updateInfo(userInfo: UserInfo) {
    try {
      const res = await userApi.updateInfo(userInfo)
      showSuccess(res.data.message)
      age.value = userInfo.age
      avatar.value = userInfo.avatar
      city.value = userInfo.city
      gender.value = userInfo.gender
      institute.value = userInfo.institute
      introduction.value = userInfo.introduction
    } catch (_) {
      return Promise.reject()
    }
  }

  async function fetchPosts() {
    if (!id.value) return
    try {
      const res = await postApi.getUserPosts(id.value)
      posts.value = res.data.data.posts.content
    } catch (_) {
      return Promise.reject()
    }
  }

  async function addPost(content: string, imageIds: string[]) {
    try {
      const res = await postApi.addPost(content, imageIds)
      const post = res.data.data.post
      posts.value.unshift(post)
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

  function $reset() {
    token.value = undefined
    id.value = undefined
    username.value = undefined
    email.value = undefined
    avatar.value = 'default-avatar'
    gender.value = undefined
    age.value = undefined
    city.value = undefined
    institute.value = undefined
    introduction.value = undefined
    likedByUserIdList.value = []
    likesUserIdList.value = []
    OSSUtil.value = null
    removeToken()
  }

  return {
    token,
    id,
    username,
    email,
    avatar,
    gender,
    age,
    city,
    institute,
    introduction,
    likedByUserIdList,
    likesUserIdList,
    OSSUtil,
    posts,
    initUser,
    login,
    updateInfo,
    fetchPosts,
    addPost,
    deletePost,
    $reset
  }
})
