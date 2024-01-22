import { Session } from '@/types/Session'
import { defineStore } from 'pinia'
import { Ref, computed, ref } from 'vue'
import messageApi from '@/api/message'
import meetApi from '@/api/meet'
import { Message } from '@/types/Message'
import moment from 'moment'
import {
  ClientToServerEvents,
  IClientToServerMessage,
  ServerToClientEvents
} from '@/types/socket.io'
import { Socket, io } from 'socket.io-client'
import router from '@/router'
import { showConfirmDialog, showDialog } from 'vant'
import { showError, showSuccess } from '@/utils/show'

export const useMessageStore = defineStore('message', () => {
  const sessions = ref<Session[]>([])
  const sortedSessions = computed(() => {
    return sessions.value.sort((a, b) => {
      return (
        new Date(b.messages.slice(-1)[0].timestamp).getTime() -
        new Date(a.messages.slice(-1)[0].timestamp).getTime()
      )
    })
  })

  let socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined = undefined
  const matchSession = ref<Session>()
  const isMatching = ref(false)
  const viewProfileStatus: Ref<'NOT_REQUESTED' | 'REQUESTED' | 'ACCEPTED' | 'REJECTED'> =
    ref('NOT_REQUESTED')

  const totalSessions = computed(() => {
    const s = [...sessions.value]
    if (matchSession.value) {
      s.push(matchSession.value)
    }
    return s
  })
  const totalUnread = computed(() => {
    return totalSessions.value.reduce((count, session) => {
      if (!session.lastRead) {
        return count + session.messages.length
      } else {
        const unreadInSession = session.messages.filter((message) =>
          moment(message.timestamp).isAfter(moment(session.lastRead))
        )
        return count + unreadInSession.length
      }
    }, 0)
  })

  // 连接私信服务器
  function connectChatServer(token: string) {
    socket = io(import.meta.env.VITE_CHAT_SERVER_URL, {
      auth: { token }
    })
    bindEvents()
  }

  // 断开私信服务器
  function disconnectChatServer() {
    socket?.disconnect()
  }

  // 绑定事件
  function bindEvents() {
    // 连接私信服务器成功
    socket?.on('connect', () => {
      console.log('Connected to chat server')
      restoreSessions()
    })

    // 收到私信
    socket?.on('privateMessage', async (payload) => {
      const session = fetchSession(payload.sessionId)
      // 如果会话已存在，将消息添加到会话中
      if (session) {
        session.messages.push(payload.message)
      } else {
        // 否则，说明是一个新会话
        // 获取会话对方信息
        const senderId = payload.message.senderId
        try {
          const res = await meetApi.getUserById(senderId)
          const peer = res.data.data.user
          if (!peer) return
          // 创建会话
          const session: Session = {
            id: payload.sessionId,
            peer,
            messages: [payload.message]
          }
          // 加入sessions前，二次校验
          addSession(session)
        } catch (error) {
          /* empty */
        }
      }
    })

    // 收到正在输入事件
    socket?.on('startTyping', (sessionId) => {
      const session = fetchSession(sessionId)
      if (session) {
        session.isPeerTyping = true
      }
    })

    // 收到停止输入事件
    socket?.on('stopTyping', (sessionId) => {
      const session = fetchSession(sessionId)
      if (session) {
        session.isPeerTyping = false
      }
    })

    // 处理连接错误
    socket?.on('connect_error', (error) => {
      console.warn(error.message)
    })

    // 对方查看了自己发送的闪图
    socket?.on('viewDisappearingImage', (sessionId, messageId) => {
      const session = fetchSession(sessionId)
      if (session) deleteMessage(session, messageId)
    })

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

  // 获取聊天会话列表
  async function initSessions() {
    try {
      const res = await messageApi.getSessions()
      sessions.value = res.data.data.sessions
    } catch (_) {
      return Promise.reject()
    }
  }

  // 断线重连，恢复会话列表
  async function restoreSessions() {
    try {
      const res = await messageApi.getSessions()
      const restoreSessions = res.data.data.sessions
      for (const session of restoreSessions) {
        const index = sessions.value.findIndex((s) => s.id === session.id)
        if (index === -1) {
          sessions.value.push(session)
        } else {
          Object.assign(sessions.value[index], session)
        }
      }
    } catch (_) {
      return Promise.reject()
    }
  }

  function addSession(session: Session) {
    if (sessions.value.findIndex((s) => s.id === session.id) === -1) {
      sessions.value.push(session)
    }
  }

  // 创建聊天会话
  async function createSession(recipientId: string) {
    try {
      const res = await meetApi.getUserById(recipientId)
      const peer = res.data.data.user
      if (!peer) {
        return Promise.reject('聊天用户不存在')
      }
      const session: Session = {
        id: '',
        peer,
        messages: []
      }
      addSession(session)
      return fetchSession(session.id)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  function fetchSession(sessionId: string) {
    if (sessionId === matchSession.value?.id) {
      return matchSession.value
    }
    return sessions.value.find((session) => session.id === sessionId)
  }

  function sendMessage(session: Session, message: IClientToServerMessage) {
    return new Promise((resolve, reject) => {
      socket?.timeout(5000).emit('privateMessage', session.id, message, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        if (res.type === 'ERROR') {
          reject(res.message)
          return
        }
        if (!session.id) {
          session.id = res.data!.sessionId
          addSession(session)
        }
        session.messages.push(res.data!.message)
        resolve(res)
      })
    })
  }

  function startTyping(session: Session) {
    if (!session.id) return
    socket?.emit('startTyping', session.id, (res) => {
      if (res.type === 'ERROR') {
        console.warn(res.message)
      }
    })
  }

  function stopTyping(session: Session) {
    if (!session.id) return
    socket?.emit('stopTyping', session.id, (res) => {
      if (res.type === 'ERROR') {
        console.warn(res.message)
      }
    })
  }

  function viewDisappearingImage(session: Session, message: Message) {
    return new Promise((resolve, reject) => {
      socket?.timeout(5000).emit('viewDisappearingImage', session.id, message._id, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        if (res.type === 'ERROR') {
          reject(res.message)
          return
        }
        deleteMessage(session, message._id)
        resolve(res)
      })
    })
  }

  function readMessages(session: Session) {
    socket?.timeout(5000).emit('readMessages', session.id, (err, res) => {
      if (err) {
        console.warn(err)
      } else if (res.type === 'ERROR') {
        console.warn(res.message)
      }
    })
    session.lastRead = new Date().toISOString()
  }

  function deleteMessage(session: Session, messageId: string) {
    const index = session.messages.findIndex((m) => m._id === messageId)
    if (index !== -1) {
      session.messages.splice(index, 1)
    }
  }

  function countUnreadMessages(session: Session) {
    const lastRead = session.lastRead
    if (!lastRead) return session.messages.length
    const lastReadTime = moment(lastRead)
    const unreadMessages = session.messages.filter((message) =>
      moment(message.timestamp).isAfter(lastReadTime)
    )
    return unreadMessages.length
  }

  function matchRequest() {
    if (isMatching.value) {
      return Promise.reject('正在匹配中')
    }
    if (matchSession.value) {
      return Promise.reject('已有匹配，请先删除匹配')
    }
    return new Promise((resolve, reject) => {
      socket?.timeout(5000).emit('matchRequest', (err, res) => {
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
    sessions,
    sortedSessions,
    totalUnread,
    matchSession,
    isMatching,
    viewProfileStatus,
    initSessions,
    fetchSession,
    createSession,
    bindEvents,
    connectChatServer,
    disconnectChatServer,
    sendMessage,
    startTyping,
    stopTyping,
    viewDisappearingImage,
    readMessages,
    countUnreadMessages,
    matchRequest,
    matchCancel,
    matchLeave,
    requestViewProfile,
    responseViewProfile
  }
})
