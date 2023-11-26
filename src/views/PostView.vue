<template>
  <div class="post-view" ref="root">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        class="post-list"
        v-model:loading="loading"
        v-model:error="error"
        :finished="hasFetchedAll"
        finished-text="没有更多了"
        error-text="请求失败，请重试"
        @load="onLoad"
      >
        <div class="post-card-container" v-for="post in posts" :key="post.id">
          <post-card
            :post="post"
            @body-clicked="router.push(`/post/${post.id}`)"
            @avatar-clicked="router.push(`/user/${post.user.id}`)"
          />
          <van-divider />
        </div>
      </van-list>
    </van-pull-refresh>
    <van-back-top right="10vw" bottom="10vh" />
  </div>
</template>

<script setup lang="ts">
import { Post } from '@/types/Post'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import postApi from '@/api/post'

import { usePreserveScroll } from '@/hooks/usePreserveScroll'

const root = ref<HTMLElement | undefined>()
usePreserveScroll(root, 'post')

const router = useRouter()
const posts = ref<Post[]>([])

const loading = ref(false)
const error = ref(false)
const refreshing = ref(false)

const pageSize = 10
const page = ref(1)
const hasFetchedAll = ref(false)

const onLoad = async () => {
  try {
    const res = await postApi.retrievePosts(page.value)
    const newPosts = res.data.data.posts.content
    if (page.value === 1) posts.value = newPosts
    else posts.value.push(...newPosts)
    hasFetchedAll.value = res.data.data.posts.total <= pageSize * page.value
    page.value++
  } catch (_) {
    error.value = true
  } finally {
    refreshing.value = false
    loading.value = false
  }
}

const onRefresh = () => {
  page.value = 1
  hasFetchedAll.value = false
  error.value = false
  loading.value = true
  onLoad()
}
</script>

<style scoped lang="scss">
.post-view {
  .post-list {
    min-height: calc(100vh - var(--height-navbar) - var(--height-tabbar));
  }
}
</style>
