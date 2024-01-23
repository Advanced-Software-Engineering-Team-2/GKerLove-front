import { Session } from '@/types/Session'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { socket } from '@/socket'
import router from '@/router'
import { showConfirmDialog, showDialog } from 'vant'
import { showError, showSuccess } from '@/utils/show'

export const useMatchStore = defineStore('match', () => {
  const matchSession = ref<Session>()
  const isMatching = ref(false)
  const viewProfileStatus: Ref<'NOT_REQUESTED' | 'REQUESTED' | 'ACCEPTED' | 'REJECTED'> =
    ref('NOT_REQUESTED')

  function bindEvents() {
    // 匹配成功
    socket?.on('matchSuccess', (sessionId, peerId) => {
      matchSession.value = {
        id: sessionId,
        peer: {
          id: peerId,
          username: 'Anonymous',
          email: 'Anonymous',
          avatar: 'https://gker-love.oss-cn-beijing.aliyuncs.com/Anonymous.png'
        },
        anonymous: true,
        messages: []
      }
      viewProfileStatus.value = 'NOT_REQUESTED'
      isMatching.value = false
      router.push({
        name: 'chatWindow',
        params: {
          id: 'Anonymous'
        }
      })
    })

    // 对方离开
    socket?.on('matchLeave', () => {
      matchSession.value = undefined
      viewProfileStatus.value = 'NOT_REQUESTED'
      const route = router.currentRoute.value
      showDialog({
        message: '匿名聊天对方已离开匿名聊天会话',
        confirmButtonText: '确定',
        showCancelButton: false,
        beforeClose: () => {
          if (route.name === 'chatWindow' && route.params.id === 'Anonymous') {
            router.push({ name: 'meet' })
          }
          return true
        }
      })
    })

    // 对方请求查看资料
    socket?.on('viewProfileRequest', (sessionId) => {
      if (matchSession.value && matchSession.value.id === sessionId) {
        showConfirmDialog({
          message: '匿名聊天对方请求查看你的资料',
          confirmButtonText: '同意',
          cancelButtonText: '拒绝'
        })
          .then(() => {
            responseViewProfile(true)
          })
          .catch(() => {
            responseViewProfile(false)
          })
      }
    })

    // 对方同意/拒绝查看资料
    socket?.on('viewProfileResponse', (sessionId, accept) => {
      if (matchSession.value && matchSession.value.id === sessionId) {
        if (accept) {
          showSuccess('匿名聊天对方同意了你的查看资料请求')
          viewProfileStatus.value = 'ACCEPTED'
        } else {
          showError('匿名聊天对方拒绝了你的查看资料请求')
          viewProfileStatus.value = 'REJECTED'
        }
      }
    })
  }

  function matchRequest(condition: { diffGender: boolean; noPreviousMatch: boolean }) {
    if (isMatching.value) {
      return Promise.reject('正在匹配中')
    }
    if (matchSession.value) {
      return Promise.reject('已有匹配，请先删除匹配')
    }
    return new Promise((resolve, reject) => {
      socket?.timeout(5000).emit('matchRequest', condition, (err, res) => {
        if (err) {
          isMatching.value = false
          reject(err)
          return
        }
        if (res.type === 'ERROR') {
          isMatching.value = false
          reject(res.message)
          return
        }
        isMatching.value = true
        resolve(res)
      })
    })
  }

  function matchCancel() {
    return new Promise((resolve, reject) => {
      socket?.timeout(5000).emit('matchCancel', (err, res) => {
        if (err) {
          reject(err)
          return
        }
        if (res.type === 'ERROR') {
          reject(res.message)
          return
        }
        isMatching.value = false
        resolve(res)
      })
    })
  }

  function matchLeave() {
    return new Promise((resolve, reject) => {
      socket?.timeout(5000).emit('matchLeave', (err, res) => {
        if (err) {
          reject(err)
          return
        }
        if (res.type === 'ERROR') {
          reject(res.message)
          return
        }
        resolve(res)
        matchSession.value = undefined
        viewProfileStatus.value = 'NOT_REQUESTED'
      })
    })
  }

  function requestViewProfile() {
    return new Promise((resolve, reject) => {
      if (matchSession.value) {
        socket?.timeout(5000).emit('viewProfileRequest', matchSession.value.id, (err, res) => {
          if (err) {
            reject(err)
            return
          }
          if (res.type === 'ERROR') {
            reject(res.message)
            return
          }
          viewProfileStatus.value = 'REQUESTED'
          resolve(res)
        })
      } else {
        reject('没有匹配的会话')
      }
    })
  }

  function responseViewProfile(accept: boolean) {
    return new Promise((resolve, reject) => {
      if (matchSession.value) {
        socket
          ?.timeout(5000)
          .emit('viewProfileResponse', matchSession.value.id, accept, (err, res) => {
            if (err) {
              reject(err)
              return
            }
            if (res.type === 'ERROR') {
              reject(res.message)
              return
            }
            resolve(res)
          })
      } else {
        reject('没有匹配的会话')
      }
    })
  }

  return {
    matchSession,
    isMatching,
    viewProfileStatus,
    bindEvents,
    matchRequest,
    matchCancel,
    matchLeave,
    requestViewProfile,
    responseViewProfile
  }
})
