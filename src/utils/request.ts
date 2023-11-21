import axios, { type AxiosResponse } from 'axios'
import { showConfirmDialog } from 'vant'
import { showError } from './show'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/user'
import type { R } from '@/types/R'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

request.interceptors.request.use(
  (config) => {
    const user = useUserStore()
    if (user.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<R<any>>) => {
    const res = response.data
    if (res.code !== 'SUCCESS') {
      showError(res.message)
      if (res.code === 'UNAUTHENTICATED') {
        showConfirmDialog({
          title: '确认登出',
          message: '你已经登出系统, 你可以取消停留在该页面，或重新登录',
          confirmButtonText: '重新登录',
          cancelButtonText: '取消'
        }).then(() => {
          const userStore = useUserStore()
          userStore.$reset()
          location.assign('/login')
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response
    }
  },
  (error) => {
    console.log(error)
    showError(error.message)
    return Promise.reject(error)
  }
)

export default request
