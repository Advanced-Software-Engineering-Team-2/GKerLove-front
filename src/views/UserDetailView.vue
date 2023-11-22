<template>
  <van-nav-bar
    left-arrow
    title="用户详情"
    @click-left="router.back()"
    :border="false"
    safe-area-inset-top
  />
  <div class="user-detail-view">
    <user-card :user="user" v-if="user" />
    <van-divider />
    <loading-card v-if="loading" />
    <div v-else>
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
      <van-floating-bubble
        icon="chat"
        @click="handleChatClicked"
        v-if="userStore.username !== user?.username"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import meetApi from '@/api/meet'
import { ref } from 'vue'
import { User } from '@/types/User'
import { useUserStore } from '@/stores/user'
import { Post } from '@/types/Post'
import { usePostStore } from '@/stores/post'
import { useMeetStore } from '@/stores/meet'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const postStore = usePostStore()
const meetStore = useMeetStore()
const user = meetStore.userList.find((user) => user.id === route.params.id) as User
const posts = ref<Post[]>([])

const loading = ref(false)

const fetchUserDetail = async () => {
  const id = route.params.id
  if (!id || Array.isArray(id)) {
    router.push('/404')
  } else {
    try {
      loading.value = true
      await meetApi.getUserById(id)
      await postStore.fetchUserPosts(user)
      posts.value = postStore.userPosts[user.id]
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }
}

const handleChatClicked = () => {
  router.push({
    name: 'chat',
    params: {
      id: user.id
    }
  })
}

fetchUserDetail()
</script>

<style scoped lang="scss">
.user-detail-view {
  .user-card {
    height: 50vh;
  }
}

.posts {
  margin: 10px 0;
}
</style>
