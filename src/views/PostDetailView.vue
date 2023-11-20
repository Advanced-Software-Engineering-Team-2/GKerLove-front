<template>
  <div class="post-detail-view">
    <div class="body">
      <van-nav-bar
        left-arrow
        title="详情"
        @click-left="router.back()"
        :border="false"
        safe-area-inset-top
      />

      <div class="content">
        <post-card :post="post" />
        <van-divider />
        <div class="comment-list" ref="root">
          <div class="comment-container" v-for="comment in post.commentList" :key="comment.id">
            <post-card-header class="comment-header" :post="comment" />
            <div class="comment-body">{{ comment.content }}</div>
            <van-divider />
          </div>
        </div>

        <van-loading class="loading" v-if="loading" size="2rem" />

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

import { ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollParent } from '@vant/use'

import { showError } from '@/utils/show'
import { usePostStore } from '@/stores/post'
import { Post } from '@/types/Post'
import { computed } from 'vue'

const root = ref<HTMLElement | undefined>()
const scrollParent = useScrollParent(root) as Ref<HTMLElement>

const router = useRouter()
const route = useRoute()

const postStore = usePostStore()
let postId = ref(route.params.id as string)
let from = ref(route.query.from)

const post = computed(() => {
  // 已经在路由守卫中判断过，此时id一定在postStore中
  if (from.value && from.value === 'home') {
    return postStore.myPosts.find((post) => post.id === postId.value) as Post
  }
  return postStore.posts.find((post) => post.id === postId.value) as Post
})

const loading = ref(false)
const comment = ref('')

const fetchPostDetail = async () => {
  try {
    loading.value = true
    await postStore.syncPost(post.value)
  } catch (_) {
    /* empty */
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  () => {
    if (route.name === 'postDetail') {
      postId.value = route.params.id as string
      from.value = route.query.from
      fetchPostDetail()
    }
  }
)

const handleSendButtonClicked = async () => {
  if (comment.value.trim() === '') {
    showError('评论不能为空')
    return
  }
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

await fetchPostDetail()
</script>

<style scoped lang="scss">
.body {
  height: calc(100vh - 100px);
  overflow: auto;

  .loading {
    text-align: center;
  }
}

.footer {
  height: 68px;
}

.comment-container {
  .comment-body {
    padding: 15px 0;
  }
}
</style>
