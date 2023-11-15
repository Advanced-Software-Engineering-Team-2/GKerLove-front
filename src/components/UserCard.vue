<template>
  <div class="user-card">
    <div class="row-1">
      <div class="avatar">
        <van-image :src="user.avatarUrl" round :show-loading="false" width="100px" height="100px" />
      </div>
      <div class="info">
        <h3 class="username">{{ user.username }}</h3>
        <div class="detail">
          <p>性别： {{ user.info.gender ? user.info.gender : '未填写' }}</p>
          <p>年龄： {{ user.info.age ? user.info.age : '未填写' }}</p>
          <p>所在城市： {{ user.info.city ? user.info.city : '未填写' }}</p>
          <p>培养单位： {{ user.info.institute ? user.info.institute : '未填写' }}</p>
        </div>
      </div>
    </div>
    <van-divider />
    <div class="row-2">
      <p>自我介绍：{{ user.info.introduction }}</p>
    </div>
    <van-divider />
    <div class="row-3">
      <span>人气： {{ user.likedBy }}</span>
      <span>喜欢： {{ user.likes }}</span>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = useUserStore()
user.getUser()
</script>

<style scoped lang="scss">
.user-card {
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
  }
}
</style>
