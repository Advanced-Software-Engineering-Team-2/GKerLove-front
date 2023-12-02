<template>
  <back-nav-bar title="用户详情" />
  <loading-card v-if="loading" />
  <div class="user-detail-view" v-else>
    <!-- only show user info when user is not null -->
    <user-card :user="user" v-if="user" />
    <van-divider />
    <loading-card v-if="postLoading" />
    <div class="posts" v-if="user && postStore.userPosts.get(user.id)?.length">
      <div class="post-container" v-for="post in postStore.userPosts.get(user.id)" :key="post.id">
        <post-card
          :post="post"
          :show-user="false"
          @body-clicked="router.push(`/post/${post.id}?source=${user.id}`)"
        />
        <van-divider />
      </div>
    </div>
    <van-empty v-else description="暂无动态" image-size="8rem" />
    <chat-icon
      class="chat-icon"
      @click="handleChatClicked"
      v-if="user && user.id !== userStore.id"
    />
    <div v-if="user && user.id !== userStore.id">
      <dislike-icon
        v-if="user && meetStore.likeUserList.some((u) => u.id === user!.id)"
        class="like-icon"
        @click="handleDisLikeSomeone"
      />
      <like-icon v-else class="like-icon" @click="handleLikeSomeone" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/User'

import { nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import meetApi from '@/api/meet'
import { onActivated } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useMeetStore } from '@/stores/meet'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const postStore = usePostStore()
const meetStore = useMeetStore()

const user = ref<User>()
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
    await postStore.fetchUserPosts(id)
  } catch (_) {
    /* empty */
  } finally {
    postLoading.value = false
  }
}

const handleChatClicked = () => {
  router.push({
    name: 'chatWindow',
    params: {
      id: user.value?.id
    }
  })
}

const handleLikeSomeone = async () => {
  if (!user.value) return
  try {
    await meetStore.likeSomeone(user.value)
  } catch (_) {
    /* empty */
  }
}

const handleDisLikeSomeone = async () => {
  if (!user.value) return
  try {
    await meetStore.unlikeSomeone(user.value)
  } catch (_) {
    /* empty */
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
