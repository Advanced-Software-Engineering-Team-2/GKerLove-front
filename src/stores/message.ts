import { Session } from '@/types/Session'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import socket from '@/socket'
import messageApi from '@/api/message'
import { SockeIoMessage } from '@/types/socket.io'

export const useMessageStore = defineStore('message', () => {
  const sessions = ref<Session[]>([])
  const sortedSessions = computed(() =>
    sessions.value.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
  )

  async function initSessions() {
    try {
      const res = await messageApi.getSessions()
      sessions.value = res.data.data.sessions
      console.log(sessions.value)
    } catch (_) {
      return Promise.reject()
    }
  }

  async function createSession(recipientId: string) {
    try {
      const res = await messageApi.createSession(recipientId)
      sessions.value.push(res.data.data.session)
      return fetchSession(recipientId)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  function fetchSession(recipientId: string) {
    return sessions.value.find((session) => session.recipient.id === recipientId)
  }

  function bindEvents() {
    socket.on('connect', () => {
      console.log('connected to chat server')
    })

    socket.on('privateMessage', (message) => {
      addMessageToSession(message)
    })
  }

  function connectChatServer(token: string) {
    socket.auth = { token }
    socket.connect()
  }

  function sendMessage(content: string, to: string, type: 'text' | 'image') {
    socket.emit('privateMessage', content, to, type, (message) => {
      addMessageToSession(message)
    })
  }

  function readMessages(sessionId: string) {
    socket.emit('readMessages', sessionId)
  }

  function addMessageToSession(message: SockeIoMessage) {
    const session = sessions.value.find(
      (session) =>
        (session.initiator.id === message.sender_id &&
          session.recipient.id === message.recipient_id) ||
        (session.initiator.id === message.recipient_id &&
          session.recipient.id === message.sender_id)
    )

    if (session) {
      session.messages.push({
        id: message.id,
        timestamp: message.timestamp,
        type: message.type,
        senderId: message.sender_id,
        recipientId: message.recipient_id,
        content: message.content
      })
    }
  }

  return {
    sortedSessions,
    initSessions,
    fetchSession,
    createSession,
    bindEvents,
    connectChatServer,
    sendMessage,
    readMessages
  }
})
