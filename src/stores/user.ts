import { defineStore } from 'pinia'
import type { User } from '@/types/User'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as User | null
    }
  }
})
