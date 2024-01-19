<template>
  <div class="user-list">
    <div
      class="user-list-item"
      v-for="user in userList"
      :key="user.id"
      @click="$emit('item-clicked', user.id)"
    >
      <van-space size="2rem">
        <van-image class="avatar" round :src="user.avatar" lazy-load />
        <span class="username">{{ user.username }}</span>
      </van-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@/types/User'

import { toRefs } from 'vue'

const props = defineProps<{
  userList: User[]
}>()

const { userList } = toRefs(props)
</script>

<style scoped lang="scss">
.user-list {
  .user-list-item {
    margin: 10px;

    .avatar {
      width: 4rem;
      height: 4rem;
    }

    .username {
      font-size: 1.2em;
    }
  }
}
</style>
