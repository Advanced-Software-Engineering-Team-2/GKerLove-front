<template>
  <van-nav-bar
    left-arrow
    title="用户详情"
    @click-left="router.back()"
    :border="false"
    safe-area-inset-top
  />
  <loading-card v-if="loading" />
  <div class="user-detail-view" v-else>
    <user-card :user="user" v-if="user" />
    <van-divider />
    <div>
      <loading-card v-if="postLoading" />
      <van-pull-refresh @refresh="onRefresh" v-else>
        <div class="posts" v-if="posts.length">
          <div class="post-container" v-for="post in posts" :key="post.id">
            <post-card
              :post="post"
              :show-user="false"
              @body-clicked="router.push(`/post/${post.id}?from=user`)"
            />
            <van-divider />
          </div>
        </div>
        <van-empty v-else description="暂无动态" image-size="8rem" />
      </van-pull-refresh>
      <van-floating-bubble
        icon="chat"
        @click="handleChatClicked"
        v-if="userStore.username !== user?.username"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/User'
import type { Post } from '@/types/Post'

import { ref, onActivated } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useMeetStore } from '@/stores/meet'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const postStore = usePostStore()
const meetStore = useMeetStore()

const user = ref<User>()
const posts = ref<Post[]>([])
const loading = ref(false)
const postLoading = ref(false)
let keep = false

const fetchUserPosts = async () => {
  try {
    postLoading.value = true
    await postStore.fetchUserPosts(user.value!)
  } catch (_) {
    /* empty */
  } finally {
    postLoading.value = false
  }
}

const handleChatClicked = () => {
  router.push({
    name: 'chat',
    params: {
      id: user.value!.id
    }
  })
}

const onRefresh = async () => {
  try {
    await fetchUserPosts()
    posts.value = postStore.userPosts.get(user.value!.id) || []
  } catch (_) {
    /* empty */
  } finally {
    loading.value = false
  }
}

onBeforeRouteLeave((to, _, next) => {
  if (to.name === 'postDetail') {
    keep = true
  } else {
    keep = false
  }
  next()
})

onActivated(async () => {
  // 进入用户详情页面
  const userId = route.params.id as string
  if (!keep) {
    // 重用用户详情页组件
    // 如果用户详情页面的用户不是当前用户，需要重新获取用户信息
    try {
      loading.value = true
      user.value = await meetStore.getUserById(userId)
    } catch (_) {
      router.push('/404')
    } finally {
      loading.value = false
    }
    await fetchUserPosts()
    posts.value = postStore.userPosts.get(user.value!.id) || []
  }
})
</script>

<style scoped lang="scss">
.user-detail-view {
  .user-card {
    height: 50vh;
  }

  .posts {
    margin: 10px 0;
  }
}
</style>
