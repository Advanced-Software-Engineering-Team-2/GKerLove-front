<template>
  <div class="post-card">
    <van-config-provider
      :theme-vars="{
        dividerMargin: '0.5rem'
      }"
    >
      <div class="header">
        <div class="avatar">
          <van-image :src="avatarUrl" round :show-loading="false" width="3rem" height="3rem" />
        </div>
        <div class="wrapper">
          <div class="username">{{ username }}</div>
          <div class="time">{{ formattedTime }}</div>
        </div>
      </div>
      <van-divider />
      <div class="content">{{ post.content }}</div>
      <van-divider />
      <div class="footer">评论数量: {{ post.commentList.length }}</div>
    </van-config-provider>
  </div>
</template>

<script setup lang="ts">
import { Post } from '@/types/Post'
import moment from 'moment'
import { computed } from 'vue'

const { post, username, avatarUrl } = defineProps<{
  post: Post
  username: string
  avatarUrl: string
}>()

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
    justify-content: left;
    .avatar {
      display: flex;
      align-items: center;
      margin-right: 6px;
    }
  }
  .content {
    min-height: var(--post-content-min-height);
  }
}
</style>
