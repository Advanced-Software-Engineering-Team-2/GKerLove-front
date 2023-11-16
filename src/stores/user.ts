import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import userApi from '@/api/user'
import { User, UserInfo } from '@/types/User'
import { showSuccess, showError } from '@/utils/show'
import { createOSSUtil } from '@/utils/OSS'
import OSS from 'ali-oss'

interface State extends User {
  token: string
  OSSUtil: null | OSS
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      token: getToken() || '',
      id: '',
      username: '',
      email: '',
      info: {
        avatar: 'default-avatar'
      },
      likedBy: 0,
      likes: 0,
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
        this.id = user.id
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
