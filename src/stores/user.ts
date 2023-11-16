import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import userApi from '@/api/user'
import { User, UserInfo } from '@/types/User'
import { showSuccess, showError } from '@/utils/show'
import { createOSSUtil } from '@/utils/OSS'
import OSS from 'ali-oss'
import type { Post } from '@/types/Post'
import postApi from '@/api/post'

interface State extends User {
  token: string
  OSSUtil: null | OSS
  posts: Post[]
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      token: getToken() || '',
      username: '',
      email: '',
      info: {
        avatar: 'default-avatar'
      },
      likedBy: 0,
      likes: 0,
      posts: [],
      OSSUtil: null
    }
  },
  getters: {
    avatarUrl: (state) => {
      return state.OSSUtil?.signatureUrl(state.info.avatar)
    }
  },
  actions: {
    async login(username: string, password: string, captcha: string) {
      try {
        const res = await userApi.login(username, password, captcha)
        this.token = res.data.data.token
        setToken(this.token)
        showSuccess(res.data.message)
      } catch (_) {
        // 登录失败
        return Promise.reject()
      }
      await this.initUser()
    },

    async updateInfo(userInfo: UserInfo) {
      try {
        const res = await userApi.updateInfo(userInfo)
        showSuccess(res.data.message)
        this.info = { ...res.data.data.info }
      } catch (_) {
        // 更新信息失败
        return Promise.reject()
      }
    },

    async addPost(content: string, imageList: string[]) {
      try {
        const res = await postApi.addPost(content, imageList)
        showSuccess(res.data.message)
        this.posts.unshift(res.data.data.post)
      } catch (_) {
        // 发布失败
        return Promise.reject()
      }
    },

    /**
     * 初始化用户，在以下两种情况下调用：
     * 1. 用户登录
     * 2. 用户刷新页面
     */
    async initUser() {
      if (!this.token) return null
      try {
        const res = await userApi.getUser()
        const user = res.data.data.user
        this.username = user.username
        this.email = user.email
        this.info = { ...user.info }
        this.likedBy = user.likedBy
        this.likes = user.likes
        if (this.OSSUtil === null) {
          this.OSSUtil = await createOSSUtil()
        }
      } catch (_) {
        // 获取用户信息失败
        showError('获取用户信息失败')
      }
    },

    async resetToken() {
      removeToken()
      this.$reset()
    }
  }
})