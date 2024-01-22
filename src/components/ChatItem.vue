<template>
  <router-link
    :to="{ name: 'chatWindow', params: { id: session.anonymous ? 'Anonymous' : session.peer.id } }"
  >
    <div class="user">
      <van-row>
        <van-col span="4" style="display: flex">
          <van-badge
            :content="messageStore.countUnreadMessages(session)"
            max="99"
            :show-zero="false"
          >
            <van-image round :src="session.peer.avatar" class="avatar" />
          </van-badge>
        </van-col>
        <van-col span="20" style="display: flex">
          <div class="info" style="width: 100%">
            <div class="header">
              <div class="name">{{ session.peer.username }}</div>
              <div class="time" v-if="session.messages.length">
                {{ formatTime(session.messages[session.messages.length - 1].timestamp) }}
              </div>
            </div>
            <div v-if="session.messages.length">
              <div
                class="last-message"
                v-if="session.messages[session.messages.length - 1].type === 'text'"
              >
                {{ session.messages[session.messages.length - 1].content }}
              </div>
              <div class="last-message" v-else>[ 图片 ]</div>
            </div>
          </div>
        </van-col>
      </van-row>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import moment from 'moment'
import { Session } from '@/types/Session'
import { useMessageStore } from '@/stores/message'

const messageStore = useMessageStore()

defineProps<{
  session: Session
}>()

const formatTime = (timestamp: string) => {
  return moment(timestamp).format('MM/DD')
}
</script>

<style scoped lang="scss">
.user {
  .avatar {
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
  .info {
    .header {
      display: flex;
      justify-content: space-between;
    }

    .last-message {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
