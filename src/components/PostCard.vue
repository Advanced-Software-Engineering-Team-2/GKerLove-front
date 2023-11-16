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
import { useUserStore } from '@/stores/user'
import moment from 'moment'
import { computed } from 'vue'

const user = useUserStore()

const { post, me } = withDefaults(
  defineProps<{
    post: Post
    me?: boolean
  }>(),
  {
    me: false
  }
)

const formattedTime = computed(() => {
  return moment(post.time).format('MM月DD日 HH:mm')
})

const avatarUrl = computed(() => {
  if (me) return user.avatarUrl
  return user.OSSUtil?.signatureUrl(post.user.info.avatar)
})

const username = computed(() => {
  if (me) return user.username
  return post.user.username
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
