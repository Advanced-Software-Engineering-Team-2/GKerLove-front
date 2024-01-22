<template>
  <div class="chat-view">
    <van-empty
      description="暂无消息"
      v-if="!messageStore.sortedSessions.length && !messageStore.matchSession"
    />
    <div v-else>
      <div class="anonymous" v-if="messageStore.matchSession">
        <chat-item :session="messageStore.matchSession" />
      </div>
      <ul class="user-list">
        <li v-for="session in messageStore.sortedSessions" :key="session.id">
          <chat-item :session="session" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message'

const messageStore = useMessageStore()
</script>

<style scoped lang="scss">
.chat-view {
  height: 100%;
  .anonymous {
    margin-top: 20px;
  }
  .user-list {
    height: 100%;
    overflow-y: auto;
    li {
      margin-top: 20px;
    }
  }
}
</style>
