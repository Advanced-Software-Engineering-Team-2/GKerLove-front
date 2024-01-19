<template>
  <van-sticky>
    <back-nav-bar title="动态详情" />
  </van-sticky>
  <loading-card v-if="loading" />
  <div class="post-detail-view" v-else>
    <div class="body">
      <div class="content">
        <!-- only show post when post is not null -->
        <post-card
          v-if="post"
          :post="post"
          @avatar-clicked="
            () => {
              if (post && post.user.id !== 'Anonymous') {
                router.push(`/user/${post.user.id}`)
              }
            }
          "
        />
        <van-divider />
        <loading-card v-if="commentLoading" />
        <div class="comment-list" v-else>
          <div class="comment-container" v-for="comment in post?.commentList" :key="comment.id">
            <post-card-header
              class="comment-header"
              :post="comment"
              @avatar-clicked="
                () => {
                  if (comment.user.id !== 'Anonymous') {
                    router.push(`/user/${comment.user.id}`)
                  }
                }
              "
            />
            <div class="comment-body">{{ comment.content }}</div>
            <van-divider />
          </div>
        </div>
      </div>
    </div>
    <van-sticky position="bottom" class="van-safe-area-bottom">
      <van-field
        v-model="comment"
        label="评论"
        type="textarea"
        maxlength="50"
        placeholder="输入评论..."
        show-word-limit
      >
        <template #extra>
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            "
          >
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 2px;
              "
            >
              匿名：<van-switch v-model="anonymous" size="small" />
            </div>
            <van-button size="small" type="primary" @click="handleSendButtonClicked">
              发送
            </van-button>
          </div>
        </template>
      </van-field>
    </van-sticky>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'

import { ref, onActivated, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { showError } from '@/utils/show'
import { onBeforeRouteLeave } from 'vue-router'
import { usePostStore } from '@/stores/post'

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()

const post = ref<Post>()
const comment = ref('')
const anonymous = ref(false)
const loading = ref(false)
const commentLoading = ref(false)

const scrollHeightStack: number[] = []

const fetchPostDetail = async (id: string, from: string | null) => {
  try {
    post.value = await postStore.fetchPostDetail(id, from)
    if (!post.value) {
      router.push({
        name: '404'
      })
      return
    }
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
    const postedComment = await postStore.commentOnPost(post.value.id, comment.value, anonymous.value)
    comment.value = ''
    post.value.commentList.push(postedComment)
    post.value.commentCnt++
    nextTick(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
  } catch (_) {
    /* empty */
  }
}

onActivated(async () => {
  const postId = route.params.id
  let source = route.query.source
  if (!postId || Array.isArray(postId)) {
    router.push({
      name: '404'
    })
  } else {
    const from = route.meta.from?.path
    if (!router.options.history.state.forward || from === '/' || !post.value) {
      loading.value = true
      if (Array.isArray(source)) {
        source = source[0]
      }
      await fetchPostDetail(postId, source)
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
