<template>
  <div class="post-card">
    <van-config-provider
      :theme-vars="{
        dividerMargin: '0.5rem'
      }"
    >
      <div class="header">
        <div class="left">
          <div class="avatar">
            <van-image :src="avatar" round :show-loading="false" width="3rem" height="3rem" />
          </div>
          <div class="wrapper">
            <div class="username">{{ username }}</div>
            <div class="time">{{ formattedTime }}</div>
          </div>
        </div>
        <div class="right">
          <van-button
            size="small"
            type="danger"
            v-if="showDeleteButton"
            @click="$emit('delete-button-clicked')"
          >
            删除
          </van-button>
        </div>
      </div>

      <van-divider />
      <div class="content">{{ post.content }}</div>
      <van-divider />
      <div class="image-container">
        <van-image v-for="image in post.imageList" :key="image" :src="image" lazy-load />
      </div>
      <van-divider />
      <div class="footer">评论数量: {{ post.commentList.length }}</div>
    </van-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import moment from 'moment'

import type { Post } from '@/types/Post'

const { post, username, avatar } = withDefaults(
  defineProps<{
    post: Post
    username: string
    avatar: string
    showDeleteButton?: boolean
  }>(),
  {
    showDeleteButton: false
  }
)

const formattedTime = computed(() => {
  return moment(post.time).format('MM月DD日 HH:mm')
})
</script>

<style scoped lang="scss">
.post-card {
  border: var(--post-border-width) solid var(--post-border-color);
  border-radius: var(--post-border-radius);
  padding: var(--post-padding);
  .header {
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      justify-content: left;
      .avatar {
        display: flex;
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

  .content {
    min-height: var(--post-content-min-height);
  }
  .image-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
}
</style>
