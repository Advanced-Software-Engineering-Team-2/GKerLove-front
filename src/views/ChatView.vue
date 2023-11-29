<template>
  <back-nav-bar title="聊天" />
  <div class="chat-view" v-if="session">
    <Message
      v-for="message in session.messages"
      :key="message.id"
      :message="message"
      :author="message.senderId === session.initiator.id ? session.initiator : session.recipient"
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
import { User } from '@/types/User'
import { onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const messageStore = useMessageStore()
const me = useUserStore()
const route = useRoute()
const router = useRouter()

const session = ref<Session>()

let targetUser: User | undefined = undefined

const content = ref('')

const handleSendButtonClicked = () => {
  if (!targetUser) return
  if (content.value.trim() === '') {
    return
  }
  messageStore.sendMessage(content.value, targetUser.id, 'text')
  content.value = ''
}

onActivated(async () => {
  const recipientId = route.params.id
  if (!recipientId || Array.isArray(recipientId)) {
    router.push({
      name: '404'
    })
  } else {
    let s = messageStore.fetchSession(recipientId)
    if (s) {
      session.value = s
      targetUser =
        session.value.recipient.id === me.id ? session.value.initiator : session.value.recipient
    } else {
      try {
        let s = await messageStore.createSession(recipientId)
        if (!s) {
          router.push({
            name: '404'
          })
          return
        }
        session.value = s
        targetUser =
          session.value.recipient.id === me.id ? session.value.initiator : session.value.recipient
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
