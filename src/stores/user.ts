import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import userApi from '@/api/user'

export const useUser = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      id: '',
      username: '',
      email: ''
    }
  },
  actions: {
    async login(username: string, password: string, captcha: string) {
      try {
        const res = await userApi.login(username, password, captcha)
        this.token = res.data.data.token
        setToken(this.token)
        await this.getInfo()
        return Promise.resolve()
      } catch (_) {
        return Promise.reject()
      }
    },

    async getInfo() {
      if (!this.token) return null
      const res = await userApi.getInfo()
      const userInfo = res.data.data.user
      this.id = userInfo.id
      this.username = userInfo.username
      this.email = userInfo.email
    },

    async resetToken() {
      removeToken()
      this.$reset()
    }
  }
})
