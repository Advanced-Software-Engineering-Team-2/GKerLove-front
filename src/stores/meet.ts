import { defineStore } from 'pinia'
import meetApi from '@/api/meet'
import { User } from '@/types/User'
import { showError, showSuccess } from '@/utils/show'

export const useMeetStore = defineStore('meetlist', {
  state: () => {
    return {
      userList: [] as User[]
    }
  },
  getters: {},
  actions: {
    async getUserList(
      gender?: string,
      minAge?: number,
      maxAge?: number,
      city?: string,
      institute?: string
    ) {
      try {
        const res = await meetApi.getUserList(gender, minAge, maxAge, city, institute)
        const meetinglist = res.data.data.userList
        this.userList = meetinglist
      } catch (_) {
        return Promise.reject()
      }
    },

    async addLove(fromusername: string, tousername: string) {
      try {
        const res = await meetApi.addlove(fromusername, tousername)
        const message = res.data.message
        showSuccess(message)
      } catch (_) {
        showError('发送喜欢失败')
      }
    },
    async notLove(fromusername: string, tousername: string) {
      try {
        const res = await meetApi.notlove(fromusername, tousername)
        const message = res.data.message
        showSuccess(message)
      } catch (_) {
        showError('发送不喜欢失败')
      }
    }
  }
})
