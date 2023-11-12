import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import userApi from '@/api/user'
import { User, UserInfo } from '@/types/User'
import { showSuccess, showError } from '@/utils/show'

interface State extends User {
  token: string
}

export const useUser = defineStore('user', {
  state: (): State => {
    return {
      token: getToken() || '',
      username: '',
      email: '',
      info: {
        avatar: 'default-avatar'
      },
      likedBy: 0,
      likes: 0
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
      await this.getUser()
    },

    async updateInfo(userInfo: UserInfo) {
      try {
        const res = await userApi.updateInfo(userInfo)
        showSuccess(res.data.message)
      } catch (_) {
        // 更新信息失败
        return Promise.reject()
      }
      await this.getUser()
    },

    async getUser() {
      if (!this.token) return null
      try {
        const res = await userApi.getUser()
        const user = res.data.data.user
        this.username = user.username
        this.email = user.email
        this.info = user.info
        this.likedBy = user.likedBy
        this.likes = user.likes
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
