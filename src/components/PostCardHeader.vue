<template>
  <div class="post-card-header">
    <div class="left">
      <slot name="left">
        <div class="avatar">
          <van-image
            :src="post.user.avatar"
            :show-loading="false"
            round
            width="3rem"
            height="3rem"
            @click="$emit('avatar-clicked')"
          />
        </div>
        <div>
          <div class="username">{{ post.user.username }}</div>
          <div class="time">{{ formattedTime }}</div>
        </div>
      </slot>
    </div>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Post, Comment } from '@/types/Post'

import { computed } from 'vue'
import moment from 'moment'
import { toRefs } from 'vue'

const props = defineProps<{
  post: Post | Comment
}>()

const { post } = toRefs(props)

const formattedTime = computed(() => {
  return moment(post.value.time).format('MM月DD日 HH:mm')
})
</script>

<style scoped lang="scss">
.post-card-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;

  .left {
    display: flex;
    justify-content: left;
    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 6px;
    }
  }

  .right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
