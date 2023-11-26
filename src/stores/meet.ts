import { defineStore } from 'pinia'
import meetApi from '@/api/meet'
import { User } from '@/types/User'
import { showSuccess } from '@/utils/show'
import { ref } from 'vue'

export const useMeetStore = defineStore('meet', () => {
  const userList = ref<User[]>([])
  const likeUserList = ref<User[]>([])
  const likedByUserList = ref<User[]>([])

  async function getUserList(
    gender?: string,
    minAge?: number,
    maxAge?: number,
    city?: string,
    institute?: string
  ) {
    try {
      const res = await meetApi.getUserList(gender, minAge, maxAge, city, institute)
      const meetinglist = res.data.data.userList
      userList.value = meetinglist
    } catch (_) {
      return Promise.reject()
    }
  }

  async function getUserById(id: string) {
    try {
      const res = await meetApi.getUserById(id)
      const user = res.data.data.user
      if (!user) return undefined
      const index = userList.value.findIndex((user) => user.id == user.id)
      if (index != -1) {
        userList.value[index] = user
        return userList.value[index]
      } else {
        return user
      }
    } catch (_) {
      return Promise.reject()
    }
  }

  async function getLikeUserList() {
    try {
      const res = await meetApi.getMyLikes()
      likeUserList.value = res.data.data.likes
    } catch (_) {
      return Promise.reject()
    }
  }

  async function getLikedByUserList() {
    try {
      const res = await meetApi.getWhoLikeMe()
      likedByUserList.value = res.data.data.likedBy
    } catch (_) {
      return Promise.reject()
    }
  }

  async function likeSomeone(user: User) {
    try {
      const res = await meetApi.likeSomeone(user.id)
      const index = likeUserList.value.findIndex((u) => u.id === user.id)
      if (index === -1) {
        likeUserList.value.push(user)
      }
      showSuccess(res.data.message)
    } catch (_) {
      return Promise.reject()
    }
  }

  async function unlikeSomeone(user: User) {
    try {
      const res = await meetApi.dislikeSomeone(user.id)
      const index = likeUserList.value.findIndex((u) => u.id === user.id)
      if (index !== -1) {
        likeUserList.value.splice(index, 1)
      }
      showSuccess(res.data.message)
    } catch (_) {
      return Promise.reject()
    }
  }

  return {
    userList,
    likeUserList,
    likedByUserList,
    getUserList,
    getUserById,
    getLikeUserList,
    getLikedByUserList,
    likeSomeone,
    unlikeSomeone
  }
})
