<template>
  <div class="chat-view">
    <ul class="user-list">
      <li v-for="session in sessions" :key="session.id">
        <router-link :to="{ name: 'chatWindow', params: { id: session.peer.id } }">
          <div class="user">
            <van-row>
              <van-col span="4" style="display: flex">
                <van-image round :src="session.peer.avatar" class="avatar" />
              </van-col>
              <van-col span="20" style="display: flex">
                <div class="info" style="width: 100%">
                  <div class="header">
                    <div class="name">{{ session.peer.username }}</div>
                    <div class="time">{{ formatTime(session.messages[0].timestamp) }}</div>
                  </div>
                  <van-text-ellipsis class="last-message" :content="session.messages[0].content" />
                </div>
              </van-col>
            </van-row>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { useMessageStore } from '@/stores/message'

const messageStore = useMessageStore()
const sessions = messageStore.sessions

const formatTime = (timestamp: Date) => {
  return moment(timestamp).format('MM/DD')
}
</script>

<style scoped lang="scss">
.chat-view {
  height: 100%;
  .user-list {
    height: 100%;
    overflow-y: auto; 
    li {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .user {
      &:last-child {
        margin-bottom: 0;
      }
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
      }
    }
  }
}
</style>
