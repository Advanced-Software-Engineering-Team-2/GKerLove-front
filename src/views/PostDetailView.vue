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
      <van-loading class="loading" v-if="loading" size="2rem" />

      <div class="content" v-else>
        <post-card :post="post" />

        <van-divider />

        <div class="comment-list" ref="root">
          <div class="comment-container" v-for="comment in post.commentList" :key="comment.id">
            <post-card-header class="comment-header" :post="post" />
            <div class="comment-body">{{ comment.content }}</div>
            <van-divider />
          </div>
        </div>

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
import type { Post } from '@/types/Post'

import { ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollParent } from '@vant/use'

import postApi from '@/api/post'
import { showError, showSuccess } from '@/utils/show'

const root = ref<HTMLElement | undefined>()
const scrollParent = useScrollParent(root) as Ref<HTMLElement>

const router = useRouter()
const route = useRoute()

const post = ref<Post>() as Ref<Post>
const comment = ref('')
const loading = ref(true)

const fetchPostDetail = async () => {
  const postId = route.params.id
  if (!postId || Array.isArray(postId)) {
    router.push('/404')
  } else {
    try {
      loading.value = true
      const res = await postApi.getPostById(postId)
      if (res.data.data.post === null) {
        router.push('/404')
        return
      }
      post.value = res.data.data.post
    } catch (_) {
      router.push('/404')
    } finally {
      loading.value = false
    }
  }
}

watch(
  () => route.params,
  async () => {
    if (route.name === 'postDetail') {
      await fetchPostDetail()
    }
  }
)

const handleSendButtonClicked = async () => {
  if (comment.value.trim() === '') {
    showError('评论不能为空')
    return
  }
  try {
    const res = await postApi.comment(comment.value, post.value.id)
    showSuccess(res.data.message)
    post.value.commentList.push(res.data.data.comment)
    post.value.commentCnt++
    comment.value = ''
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
