<template>
  <div class="home" ref="root">
    <div class="user-card">
      <div class="row-1">
        <div class="avatar">
          <van-image :src="user.avatar" round :show-loading="false" width="100px" height="100px" />
        </div>
        <div class="info">
          <h3 class="username">{{ user.username }}</h3>
          <div class="detail">
            <p>性别： {{ user.gender ? user.gender : '未填写' }}</p>
            <p>年龄： {{ user.age ? user.age : '未填写' }}</p>
            <p>所在城市： {{ user.city ? user.city : '未填写' }}</p>
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
        <span @click="router.push({ name: 'likedBy' })"
          >人气: {{ meetStore.likedByUserList.length }}</span
        >
        <span @click="router.push({ name: 'likes' })"
          >喜欢: {{ meetStore.likeUserList.length }}</span
        >
        <div class="button-box">
          <van-button
            color="blue"
            round
            size="small"
            @click="
              router.push({
                name: 'updateInfo'
              })
            "
            style="margin-right: 5px"
          >
            完善信息
          </van-button>
          <van-button
            color="green"
            round
            size="small"
            @click="router.push({ name: 'newPost' })"
            style="margin-right: 5px"
          >
            发布动态
          </van-button>
          <van-button color="red" round size="small" @click="handleLogoutButtonClicked">
            退出登录
          </van-button>
        </div>
      </div>
      <van-divider />
      <loading-card v-if="loading" />
      <div v-else>
        <van-empty description="暂无动态" image-size="8rem" v-if="!postStore.myPosts.length" />
        <div class="post-card-list" v-else>
          <div class="post-card-container" v-for="post in postStore.myPosts" :key="post.id">
            <post-card
              class="post-card"
              :post="post"
              :show-user="false"
              :show-delete="true"
              @delete-button-clicked="postStore.deletePost(post.id)"
              @body-clicked="router.push(`/post/${post.id}?source=my`)"
            />
            <van-divider />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { disconnectChatServer } from '@/socket'
import { ref } from 'vue'
import { usePreserveScroll } from '@/hooks/usePreserveScroll'
import { usePostStore } from '@/stores/post'
import { useMeetStore } from '@/stores/meet'

const user = useUserStore()
const postStore = usePostStore()
const meetStore = useMeetStore()
const root = ref<HTMLElement | undefined>()
const loading = ref(true)

usePreserveScroll(root, 'home')

const handleLogoutButtonClicked = async () => {
  try {
    disconnectChatServer()
    user.$reset()
    // showSuccess('退出登录成功')
    // router.push({
    //   name: 'login'
    // })
    // user.$reset()
    window.location.href = '/'
  } catch (err) {
    console.log(err)
  }
}

const fetchPosts = async () => {
  try {
    loading.value = true
    await postStore.fetchMyPosts()
  } catch (_) {
    /* empty */
  } finally {
    loading.value = false
  }
}

fetchPosts()
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

.post-card-container {
  .post-card {
    margin: 10px 0;
  }
}
</style>
