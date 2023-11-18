<template>
  <div class="post" ref="root">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        v-model:error="error"
        :finished="finished"
        finished-text="没有更多了"
        error-text="请求失败，请重试"
        @load="onLoad"
      >
        <div class="post-card-container" v-for="post in posts" :key="post.id">
          <post-card :post="post" @body-clicked="router.push(`/post/${post.id}`)" />
          <van-divider />
        </div>
      </van-list>
      <van-back-top right="10vw" bottom="10vh" />
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import postApi from '@/api/post'
import { usePreserveScroll } from '@/hooks/usePreserveScroll'

const root = ref<HTMLElement | undefined>()
usePreserveScroll(root, 'post')

const router = useRouter()

const loading = ref(false)
const error = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const posts = ref<Post[]>([])
const pageSize = 10
let page = 1

const fetchPosts = async () => {
  try {
    const res = await postApi.retrievePosts(page)
    const newPosts = res.data.data.posts.content
    posts.value.push(...newPosts)
    finished.value = res.data.data.posts.total <= page * pageSize
    page++
  } catch (e) {
    error.value = true
    /* empty */
  } finally {
    loading.value = false
  }
}

const onLoad = () => {
  if (refreshing.value) {
    posts.value = []
    page = 1
    refreshing.value = false
  }
  fetchPosts()
}

const onRefresh = () => {
  finished.value = false
  error.value = false
  loading.value = true
  onLoad()
}
</script>

<style scoped lang="scss"></style>
