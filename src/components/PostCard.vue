<template>
  <div class="post-card">
    <van-config-provider
      :theme-vars="{
        dividerMargin: '0.5rem'
      }"
    >
      <div class="header">
        <div class="avatar">
          <van-image
            :src="user.OSSUtil?.signatureUrl(post.user.info.avatar)"
            round
            :show-loading="false"
            width="3rem"
            height="3rem"
          />
        </div>
        <div class="wrapper">
          <div class="username">{{ post.user.username }}</div>
          <div class="time">{{ post.time }}</div>
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
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const { post } = defineProps<{
  post: Post
}>()
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
