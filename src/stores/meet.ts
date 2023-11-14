import { defineStore } from 'pinia'
import meetApi from '@/api/meet'
import { User} from '@/types/User'
import { showError, showSuccess} from '@/utils/show'
import OSSUtil from '@/utils/OSS'
export const useMeet = defineStore('meetlist', {
  state: () => {
    return {
        curavatar: '',
        list: [] as User[]
    }
  },
  getters: {
  },
  actions: {
    async getList(username: string, gender:string, min_age: number, max_age: number, city: string, institute:string) {
      try {
        const res = await meetApi.getmeetinglist(username, gender, min_age, max_age, city, institute)
        const meetinglist = res.data.data.meetinglist
        this.list = meetinglist
        this.curavatar = OSSUtil.signatureUrl(this.list[0].info.avatar)
      } catch (_) {
        showError('没有满足条件的对象，请更换筛选信息并重新提交！')
      }
    },
    async getavatar(index: number) {
        if(this.list.length > 0){
          this.curavatar = OSSUtil.signatureUrl(this.list[index].info.avatar)
        }
        else{
          this.curavatar = OSSUtil.signatureUrl("default-avatar")
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
    }
  }
})
