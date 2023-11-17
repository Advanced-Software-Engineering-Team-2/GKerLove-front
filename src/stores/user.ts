import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import userApi from '@/api/user'
import postApi from '@/api/post'
import { UserInfo } from '@/types/User'
import { showSuccess, showError } from '@/utils/show'
import { createOSSUtil } from '@/utils/OSS'
import OSS from 'ali-oss'
import { computed, ref } from 'vue'
import { Post } from '@/types/Post'

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
  const likedBy = ref(0)
  const likes = ref(0)
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
      likedBy.value = user.likedBy
      likes.value = user.likes
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
    const res = await postApi.getUserPosts(id.value!)
    posts.value = res.data.data.posts.content
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
    likedBy.value = 0
    likes.value = 0
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
    likedBy,
    likes,
    OSSUtil,
    posts,
    initUser,
    login,
    updateInfo,
    addPost,
    deletePost,
    fetchPosts,
    $reset
  }
})

// export const useUserStore = defineStore('user', {
//   state: (): State => {
//     return {
//       token: getToken() || '',
//       id: '',
//       username: '',
//       email: '',
//       avatar: 'default-avatar',
//       likedBy: 0,
//       likes: 0,
//       OSSUtil: null
//     }
//   },
//   getters: {
//     avatarUrl: (state) => {
//       return state.OSSUtil?.signatureUrl(state.avatar)
//     }
//   },
//   actions: {
//     async login(username: string, password: string, captcha: string) {
//       try {
//         const res = await userApi.login(username, password, captcha)
//         this.token = res.data.data.token
//         setToken(this.token)
//         showSuccess(res.data.message)
//       } catch (_) {
//         // 登录失败
//         return Promise.reject()
//       }
//       await this.initUser()
//     },

//     async updateInfo(userInfo: UserInfo) {
//       try {
//         const res = await userApi.updateInfo(userInfo)
//         showSuccess(res.data.message)
//         this.age = userInfo.age
//         this.avatar = userInfo.avatar
//         this.city = userInfo.city
//         this.gender = userInfo.gender
//         this.institute = userInfo.institute
//         this.introduction = userInfo.introduction
//       } catch (_) {
//         // 更新信息失败
//         return Promise.reject()
//       }
//     },

//     /**
//      * 初始化用户，仅在以下两种情况下调用：
//      * 1. 用户登录
//      * 2. 用户刷新页面
//      */
//     async initUser() {
//       if (!this.token) return null
//       try {
//         const res = await userApi.getUser()
//         const user = res.data.data.user
//         this.id = user.id
//         this.username = user.username
//         this.email = user.email
//         this.age = user.age
//         this.avatar = user.avatar
//         this.city = user.city
//         this.institute = user.institute
//         this.introduction = user.introduction
//         this.likedBy = user.likedBy
//         this.likes = user.likes
//         if (this.OSSUtil === null) {
//           this.OSSUtil = await createOSSUtil()
//         }
//       } catch (_) {
//         // 初始化用户失败
//         showError('初始化用户失败')
//       }
//     },

//     async resetToken() {
//       removeToken()
//       this.$reset()
//     }
//   }
// })
