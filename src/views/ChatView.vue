<template>
  <back-nav-bar title="聊天" />
  <div class="chat-view" v-if="session">
    <Message
      v-for="message in session.messages"
      :key="message.id"
      :message="message"
      :author="message.senderId === session.peer.id ? session.peer : me"
    />

    <van-field
      v-model="content"
      label="消息"
      type="textarea"
      maxlength="50"
      placeholder="输入消息..."
      show-word-limit
    />
    <van-button size="small" type="primary" @click="handleSendButtonClicked">发送</van-button>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message'
import { useUserStore } from '@/stores/user'
import { Session } from '@/types/Session'
import { showError } from '@/utils/show'
import type { Message } from '@/types/Message'
import { onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { User } from '@/types/User'

const userStore = useUserStore()
const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const session = ref<Session>()
const content = ref('')
const me = userStore.me as User

const handleSendButtonClicked = () => {
  if (!session.value) {
    showError('会话不存在')
    return
  }
  if (!me) {
    showError('未登录')
    return
  }
  if (content.value.trim() === '') {
    return
  }
  const message: Message = {
    id: '',
    content: content.value,
    senderId: me.id,
    recipientId: session.value.peer.id,
    type: 'text',
    timestamp: new Date()
  }
  messageStore.sendMessage(session.value, message)
  content.value = ''
}

onActivated(async () => {
  const recipientId = route.params.id
  if (!recipientId || Array.isArray(recipientId)) {
    router.push({
      name: '404'
    })
  } else {
    const s = messageStore.sessions.find((s) => s.peer.id === recipientId)
    if (s) {
      session.value = s
    } else {
      try {
        const s = await messageStore.createSession(recipientId)
        session.value = s
      } catch (_) {
        router.push({
          name: '404'
        })
      }
    }
  }
})
</script>

<style scoped lang="scss"></style>
