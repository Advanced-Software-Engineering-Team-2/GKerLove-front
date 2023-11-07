import { defineStore } from 'pinia'
import aboutmeAPI from '@/api/aboutme'

export const useAboutme = defineStore('aboutme', {
  state: () => {
    return {
      nickname: '',
      avatar: '',
      gender: '',
      age: '',
      city: '',
      institute: '',
      major: '',
      introduction: ''
    }
  },
  actions: {
    async setabout(username: string, nickname: string, avatar: string, gender: string, age: string, city: string, institute: string, major: string, introduction: string) {
      try {
        const res = await aboutmeAPI.setabout(username, nickname, avatar, gender, age, city, institute, major, introduction)
        await this.getabout(username)
        return Promise.resolve()
      } catch (_) {
        return Promise.reject()
      }
    },

    async getabout(username: string) {
      const res = await aboutmeAPI.getabout(username)
      const about = res.data.data.about
      this.nickname = about.nickname
      this.avatar = about.avatar
      this.gender = about.gender
      this.age = about.age
      this.city = about.city
      this.institute = about.institute
      this.major = about.major
      this.introduction = about.introduction
    }
  }
})