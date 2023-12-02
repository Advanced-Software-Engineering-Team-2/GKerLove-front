<template>
  <van-sticky>
    <back-nav-bar title="聊天" />
  </van-sticky>

  <div class="chat-window" v-if="session">
    <Message
      v-for="message in session.messages"
      :key="message.id"
      :message="message"
      :author="message.senderId === session.peer.id ? session.peer : me"
      class="message"
    />

    <van-sticky position="bottom">
      <van-field v-model="content" type="textarea" maxlength="50" show-word-limit>
        <template #button>
          <van-button size="small" type="primary" @click="handleSendButtonClicked">发送</van-button>
        </template>
      </van-field>
    </van-sticky>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message'
import { useUserStore } from '@/stores/user'
import { Session } from '@/types/Session'
import { showError } from '@/utils/show'
import type { Message } from '@/types/Message'
import { nextTick, onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { User } from '@/types/User'
import { onBeforeRouteLeave } from 'vue-router'

const userStore = useUserStore()
const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const session = ref<Session>()
const content = ref('')
const me = userStore.me as User

const handleSendButtonClicked = async () => {
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
    timestamp: new Date().toISOString()
  }
  await messageStore.sendMessage(session.value, message)
  content.value = ''
  nextTick(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  })
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

onBeforeRouteLeave(() => {
  if (session.value) {
    messageStore.readMessages(session.value)
  }
})
</script>

<style scoped lang="scss">
.chat-window {
  .message {
    margin-top: 15px;
  }
}
</style>
