import { Session } from '@/types/Session'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import socket from '@/socket'
import messageApi from '@/api/message'
import meetApi from '@/api/meet'
import { showError } from '@/utils/show'
import { useRouter } from 'vue-router'
import { Message } from '@/types/Message'
import moment from 'moment'

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
  const totalUnread = computed(() => {
    return sessions.value.reduce((count, session) => {
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
    socket.auth = { token }
    socket.connect()
  }

  // 绑定事件
  function bindEvents() {
    // 连接私信服务器成功
    socket.on('connect', () => {
      console.log('Connected to chat server')
    })

    // 收到私信
    socket.on('privateMessage', async (payload) => {
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
          if (sessions.value.findIndex((s) => s.id === session.id) === -1) {
            sessions.value.push(session)
          }
        } catch (error) {
          /* empty */
        }
      }
    })

    // 处理连接错误
    socket.on('connect_error', (error) => {
      showError(error.message)
      const router = useRouter()
      router.push('/login')
    })
  }

  // 获取聊天会话列表
  async function initSessions() {
    try {
      const res = await messageApi.getSessions()
      sessions.value = res.data.data.sessions
      console.log(sessions.value)
    } catch (_) {
      return Promise.reject()
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
      sessions.value.push(session)
      return fetchSession(session.id)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  function fetchSession(sessionId: string) {
    return sessions.value.find((session) => session.id === sessionId)
  }

  function sendMessage(session: Session, message: Message) {
    return new Promise((resolve) => {
      socket.emit('privateMessage', message, (res) => {
        if (!session.id) {
          session.id = res.sessionId
          sessions.value.push(session)
        }
        session.messages.push(res.message)
        resolve(res)
      })
    })
  }

  function readMessages(session: Session) {
    socket.emit('readMessages', session.id)
    session.lastRead = new Date().toISOString()
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

  return {
    sessions,
    sortedSessions,
    totalUnread,
    initSessions,
    fetchSession,
    createSession,
    bindEvents,
    connectChatServer,
    sendMessage,
    readMessages,
    countUnreadMessages
  }
})
