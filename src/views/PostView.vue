<template>
  <div class="post" ref="root">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        v-model:error="error"
        :finished="postStore.hasFetchedAll"
        finished-text="没有更多了"
        error-text="请求失败，请重试"
        @load="onLoad"
      >
        <div class="post-card-container" v-for="post in postStore.posts" :key="post.id">
          <post-card
            :post="post"
            @body-clicked="router.push(`/post/${post.id}`)"
            @avatar-clicked="router.push(`/user/${post.user.id}`)"
          />
          <van-divider />
        </div>
      </van-list>
      <van-back-top right="10vw" bottom="10vh" />
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { usePreserveScroll } from '@/hooks/usePreserveScroll'
import { usePostStore } from '@/stores/post'

const root = ref<HTMLElement | undefined>()
usePreserveScroll(root, 'post')

const router = useRouter()
const postStore = usePostStore()

const loading = ref(false)
const error = ref(false)
const refreshing = ref(false)

const onLoad = async () => {
  try {
    await postStore.fetchPosts()
  } catch (_) {
    error.value = true
  } finally {
    refreshing.value = false
    loading.value = false
  }
}

const onRefresh = () => {
  postStore.clearPosts()
  error.value = false
  loading.value = true
  onLoad()
}
</script>

<style scoped lang="scss"></style>
