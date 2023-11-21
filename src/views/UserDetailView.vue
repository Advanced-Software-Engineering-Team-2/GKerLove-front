<template>
  <van-nav-bar
    left-arrow
    title="用户详情"
    @click-left="router.back()"
    :border="false"
    safe-area-inset-top
  />
  <van-loading v-if="loading" />
  <div class="user-detail" v-else>
    <div class="picture">
      <van-image width="100%" :src="user?.avatar" />
    </div>
    <h1 class="username">
      <van-space>
        <span>{{ user?.username }}</span>
        <van-tag type="success" size="large">在线</van-tag>
      </van-space>
    </h1>
    <p class="info-item">人气：{{ user?.likedBy }}</p>
    <p class="introduction">{{ user?.introduction ? user.introduction : '未填写' }}</p>
    <van-tabs>
      <van-tab title="基本信息">
        <div class="info">
          <div class="info-item">
            <span>性别：{{ user?.gender ? user.gender : '未填写' }}</span>
          </div>
          <div class="info-item">
            <span>年龄：{{ user?.age ? user.age : '未填写' }}</span>
          </div>
          <div class="info-item">
            <span>所在城市：{{ user?.city ? user.city : '未填写' }}</span>
          </div>
          <div class="info-item">
            <span>培养单位：{{ user?.institute ? user.institute : '未填写' }}</span>
          </div>
        </div>
      </van-tab>
      <van-tab title="动态">
        <div class="posts">
          <div class="post-container" v-for="post in posts" :key="post.id">
            <post-card
              :post="post"
              :show-user="false"
              @body-clicked="router.push(`/post/${post.id}`)"
            />
            <van-divider />
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <van-floating-bubble
      icon="chat"
      @click="handleChatClicked"
      v-if="userStore.username !== user?.username"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import meetApi from '@/api/meet'
import postApi from '@/api/post'
import { ref } from 'vue'
import { User } from '@/types/User'
import { useUserStore } from '@/stores/user'
import { Post } from '@/types/Post'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const user = ref<User>()
const posts = ref<Post[]>([])

const loading = ref(false)

const id = route.params.id
if (!id || Array.isArray(id)) {
  router.push('/404')
} else {
  try {
    loading.value = true
    const userRes = await meetApi.getUserById(id)
    user.value = userRes.data.data.user
    if (!user.value) {
      router.push('/404')
    }
    const postRes = await postApi.getUserPosts(user.value.id)
    posts.value = postRes.data.data.posts.content
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
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
</script>

<style scoped lang="scss">
.picture {
  text-align: center;
}

.introduction {
  padding: 1rem 0;
}

.info {
  margin: 10px 0;
  .info-item {
    margin: 5px 0;
  }
}

.posts {
  margin: 10px 0;
}
</style>
