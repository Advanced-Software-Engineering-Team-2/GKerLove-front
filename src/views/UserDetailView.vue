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
    <!-- only show user info when user is not null -->
    <user-card :user="user" v-if="user" />
    <van-divider />
    <loading-card v-if="postLoading" />
    <van-pull-refresh @refresh="onRefresh" v-else>
      <div class="posts" v-if="posts.length">
        <div class="post-container" v-for="post in posts" :key="post.id">
          <post-card
            :post="post"
            :show-user="false"
            @body-clicked="router.push(`/post/${post.id}`)"
          />
          <van-divider />
        </div>
      </div>
      <van-empty v-else description="暂无动态" image-size="8rem" />
    </van-pull-refresh>
    <chat-icon
      class="chat-icon"
      @click="handleChatClicked"
      v-if="user && user.id !== userStore.id"
    />
    <div v-if="user && user.id !== userStore.id">
      <dislike-icon
        v-if="user && userStore.likeUserIdList.includes(user.id)"
        class="like-icon"
        @click="handleDisLikeSomeone"
      />
      <like-icon v-else class="like-icon" @click="handleLikeSomeone" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/User'
import type { Post } from '@/types/Post'

import { nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import postApi from '@/api/post'
import meetApi from '@/api/meet'
import { onActivated } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { showSuccess } from '@/utils/show'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const user = ref<User>()
const posts = ref<Post[]>([])
const loading = ref(false)
const postLoading = ref(false)

const scrollHeightStack: number[] = []

const fetchUserInfo = async (id: string) => {
  loading.value = true
  try {
    const res = await meetApi.getUserById(id)
    user.value = res.data.data.user
    if (!user.value) {
      router.push({
        name: '404'
      })
      return
    }
  } catch (_) {
    /* empty */
  } finally {
    loading.value = false
  }
}

const fetchUserPosts = async (id: string) => {
  postLoading.value = true
  try {
    const res = await postApi.getUserPosts(id)
    posts.value = res.data.data.posts.content
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
      id: user.value?.id
    }
  })
}

const handleLikeSomeone = async () => {
  if (!user.value?.id) return
  try {
    const res = await meetApi.likeSomeone(user.value?.id!)
    if (!userStore.likeUserIdList.includes(user.value.id)) {
      userStore.likeUserIdList.push(user.value.id)
    }
    showSuccess(res.data.message)
  } catch (_) {
    /* empty */
  }
}

const handleDisLikeSomeone = async () => {
  if (!user.value?.id) return
  try {
    const res = await meetApi.dislikeSomeone(user.value.id!)
    if (userStore.likeUserIdList.includes(user.value.id!)) {
      userStore.likeUserIdList.splice(userStore.likeUserIdList.indexOf(user.value.id), 1)
    }
    showSuccess(res.data.message)
  } catch (_) {
    /* empty */
  }
}

const onRefresh = async () => {
  if (!user.value) return
  try {
    await fetchUserPosts(user.value.id)
  } catch (_) {
    /* empty */
  } finally {
    loading.value = false
  }
}

onActivated(() => {
  const userId = route.params.id
  if (!userId || Array.isArray(userId)) {
    router.push({
      name: '404'
    })
  } else {
    const from = route.meta.from?.path
    if (!router.options.history.state.forward || from === '/' || !user.value) {
      fetchUserInfo(userId)
      fetchUserPosts(userId)
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
.user-detail-view {
  .user-card {
    height: 50vh;
  }

  .posts {
    margin: 10px 0;
  }

  .chat-icon {
    width: 4rem;
    height: 4rem;
    position: fixed;
    right: 5vh;
    bottom: 5vh;
  }

  .like-icon {
    width: 4rem;
    height: 4rem;
    position: fixed;
    left: 5vh;
    bottom: 5vh;
  }
}
</style>
