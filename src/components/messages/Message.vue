<template>
  <div class="message">
    <p v-if="showTime" class="timestamp">{{ message.timestamp }}</p>
    <div class="content" :class="author.id === user.id ? 'sent' : 'received'">
      <div class="user-avatar" @click="$emit('avatar-clicked')">
        <van-image :src="author.avatar" round width="2.5rem" height="2.5rem" class="avatar" />
      </div>
      <TextMessage v-if="message.type === 'text'" :message="message" class="text-message" />
      <ImageMessage v-else-if="message.type === 'image'" :message="message" class="image-message" />
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
    width: 100%;
    display: flex;

    &.sent {
      flex-direction: row-reverse;
      .avatar {
        margin-left: 10px;
      }
      .text-message {
        background-color: var(--sent-message-background-color);
        border-radius: 15px 5px 15px 15px;
      }
    }

    &.received {
      .avatar {
        margin-right: 10px;
      }
      .text-message {
        background-color: var(--received-message-background-color);
        border-radius: 5px 15px 15px 15px;
      }
    }

    .user-avatar {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
.text-message {
  max-width: 60vw;
  padding: 10px;
  height: auto;
}
</style>
