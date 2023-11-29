<template>
  <div class="message">
    <p v-if="showTime" class="timestamp">{{ message.timestamp }}</p>
    <div class="content" :class="author.id === user.id ? 'sent' : 'received'">
      <div class="user-avatar">
        <van-image :src="author.avatar" round />
      </div>
      <TextMessage v-if="message.type === 'text'" :message="message" />
      <ImageMessage v-else-if="message.type === 'image'" :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { Message } from '@/types/Message'
import { User } from '@/types/User'
import { toRefs } from 'vue'

const props = withDefaults(
  defineProps<{
    message: Message
    author: User
    showTime?: boolean
  }>(),
  {
    showTime: false
  }
)

const { message, showTime } = toRefs(props)

const user = useUserStore()
</script>

<style scoped lang="scss">
.message {
  .content {
    &.sent {
      color: red;
    }

    &.received {
      color: blue;
    }
  }
}
</style>
