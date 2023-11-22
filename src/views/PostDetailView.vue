<template>
  <van-nav-bar
    left-arrow
    title="动态详情"
    @click-left="router.back()"
    :border="false"
    safe-area-inset-top
  />
  <div class="post-detail-view">
    <div class="body">
      <div class="content">
        <post-card
          :post="post"
          v-if="post"
          @avatar-clicked="router.push(`/user/${post.user.id}`)"
        />
        <van-divider />
        <div class="comment-list" ref="root">
          <div class="comment-container" v-for="comment in post?.commentList" :key="comment.id">
            <post-card-header
              class="comment-header"
              :post="comment"
              @avatar-clicked="router.push(`/user/${comment.user.id}`)"
            />
            <div class="comment-body">{{ comment.content }}</div>
            <van-divider />
          </div>
        </div>
        <loading-card v-if="loading" />
        <van-back-top right="8vw" bottom="15vh" />
      </div>
    </div>
    <div class="footer">
      <van-field
        v-model="comment"
        label="评论"
        type="textarea"
        maxlength="50"
        placeholder="输入评论..."
        show-word-limit
      >
        <template #button>
          <van-button size="small" type="primary" @click="handleSendButtonClicked">发送</van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'

import { ref, nextTick, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollParent } from '@vant/use'

import { showError } from '@/utils/show'
import { usePostStore } from '@/stores/post'
import { Post } from '@/types/Post'

const root = ref<HTMLElement | undefined>()
const scrollParent = useScrollParent(root) as Ref<HTMLElement>

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()

const post = ref<Post>()
const comment = ref('')
const loading = ref(false)

const fetchPostDetail = async () => {
  if (!post.value) return
  try {
    loading.value = true
    await postStore.syncPost(post.value)
  } catch (_) {
    router.push('/404')
  } finally {
    loading.value = false
  }
}

const handleSendButtonClicked = async () => {
  if (comment.value.trim() === '') {
    showError('评论不能为空')
    return
  }
  if (!post.value) return
  try {
    loading.value = true
    await postStore.commentOnPost(post.value, comment.value)
    comment.value = ''
    await postStore.syncPost(post.value)
    loading.value = false
    nextTick(() => {
      scrollParent.value?.scrollTo({ top: scrollParent.value?.scrollHeight, behavior: 'smooth' })
    })
  } catch (_) {
    /* empty */
  }
}

onActivated(() => {
  // 进入动态详情页面
  const postId = route.params.id as string
  const from = route.query.from as string
  // 根据post存储位置获取post
  if (from === 'home') {
    post.value = postStore.myPosts.find((post) => post.id === postId)
  }
  if (from === 'user') {
    post.value = [...postStore.userPosts.values()].flat().find((post) => post.id === postId)
  } else {
    post.value = postStore.posts.find((post) => post.id === postId)
  }
  // 更新post信息
  fetchPostDetail()
})
</script>

<style scoped lang="scss">
.post-detail-view {
  .body {
    height: calc(100vh - 100px - var(--height-navbar));
    overflow: auto;
  }

  .footer {
    height: 68px;
  }

  .comment-list {
    .comment-container {
      .comment-body {
        padding: 15px 0;
      }
    }
  }
}
</style>
