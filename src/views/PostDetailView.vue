<template>
  <van-nav-bar
    left-arrow
    title="动态详情"
    @click-left="router.back()"
    :border="false"
    safe-area-inset-top
  />
  <loading-card v-if="loading" />
  <div class="post-detail-view" v-else>
    <div class="body">
      <div class="content">
        <!-- only show post when post is not null -->
        <post-card
          v-if="post"
          :post="post"
          @avatar-clicked="router.push(`/user/${post.user.id}`)"
        />
        <van-divider />
        <loading-card v-if="commentLoading" />
        <div class="comment-list" v-else>
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
import type { Post } from '@/types/Post'

import { ref, onActivated, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { showError, showSuccess } from '@/utils/show'
import postApi from '@/api/post'
import { onBeforeRouteLeave } from 'vue-router'

const router = useRouter()
const route = useRoute()

const post = ref<Post>()
const comment = ref('')
const loading = ref(false)
const commentLoading = ref(false)

const scrollHeightStack: number[] = []

const fetchPostDetail = async (id: string) => {
  try {
    const res = await postApi.getPostById(id)
    post.value = res.data.data.post
    if (!post.value) {
      router.push('/404')
      return
    }
  } catch (_) {
    /* empty */
  }
}

const commentOnPost = async (id: string, content: string) => {
  try {
    const res = await postApi.commentOnPost(id, content)
    showSuccess(res.data.message)
  } catch (_) {
    /* empty */
  }
}

const handleSendButtonClicked = async () => {
  if (comment.value.trim() === '') {
    showError('评论不能为空')
    return
  }
  if (!post.value) return
  try {
    commentLoading.value = true
    await commentOnPost(post.value.id, comment.value)
    comment.value = ''
    await fetchPostDetail(post.value.id)
    commentLoading.value = false
    nextTick(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
  } catch (_) {
    /* empty */
  }
}

onActivated(async () => {
  const postId = route.params.id
  if (!postId || Array.isArray(postId)) {
    router.push('/404')
  } else {
    const from = route.meta.from?.path
    if (!router.options.history.state.forward || from === '/' || !post.value) {
      loading.value = true
      await fetchPostDetail(postId)
      loading.value = false
    } else {
      nextTick(() => {
        window.scrollTo({ top: scrollHeightStack.pop() ?? 0 })
      })
    }
  }
})

onBeforeRouteLeave(() => {
  scrollHeightStack.push(document.body.scrollHeight)
})
</script>

<style scoped lang="scss">
.post-detail-view {
  .body {
    min-height: calc(100vh - 100px - var(--height-navbar));
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
