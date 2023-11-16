<template>
  <div class="user-card">
    <div class="row-1">
      <div class="avatar">
        <van-image
          :src="me.OSSUtil?.signatureUrl(user.avatar)"
          round
          :show-loading="false"
          width="100px"
          height="100px"
        />
      </div>
      <div class="info">
        <h3 class="username">{{ user.username }}</h3>
        <div class="detail">
          <p>性别： {{ user.gender ? user.gender : '未填写' }}</p>
          <p>年龄： {{ user.age ? user.age : '未填写' }}</p>
          <p>所在城市： {{ user.city }}</p>
          <p>培养单位： {{ user.institute ? user.institute : '未填写' }}</p>
        </div>
      </div>
    </div>
    <van-divider />
    <div class="row-2">
      <p>自我介绍：{{ user.introduction }}</p>
    </div>
    <van-divider />
    <div class="row-3">
      <span>人气: {{ user.likedBy }}</span>
      <span>喜欢: {{ user.likes }}</span>
      <slot></slot>
    </div>
    <van-divider />
    <div class="post-card-list">
      <post-card class="post-card" v-for="post in posts" :key="post.id" :post="post" :user="user" />
      <van-back-top right="10vw" bottom="10vh" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from '@/components/PostCard.vue'

import { useUserStore } from '@/stores/user'
import postApi from '@/api/post'

import type { Post } from '@/types/Post'
import { ref } from 'vue'
import { User } from '@/types/User'
import { toRefs } from '@vueuse/core'

const props = defineProps<{
  user: User
}>()

const { user } = toRefs(props)
const me = useUserStore()

const posts = ref<Post[]>()

const res = await postApi.getUserPosts(user.value.id)

posts.value = res.data.data.posts.content
</script>

<style scoped lang="scss">
.row-1 {
  display: flex;
  .avatar {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
  }
  .info {
    flex: 3;
    margin-left: 5px;
    .username {
      font-size: 1.5rem;
    }
  }
}

.row-3 {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .button-box {
    display: flex;
    align-items: center;
  }
}

.post-card {
  margin: 10px 0;
}

// .new-post-button {
//   display: block;
//   margin: 10px auto;
//   border: 0;
//   background: var(--red-gradient);
//   width: 4rem;
//   height: 4rem;
//   border-radius: 50%;
// }
</style>
