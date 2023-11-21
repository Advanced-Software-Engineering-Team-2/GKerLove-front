<template>
  <!-- <meet-card class="meet-card"/> -->
  <div class="meet">
    <van-swipe class="swipe" lazy-render :show-indicators="false">
      <van-swipe-item v-for="user in meetStore.userList" :key="user.id">
        <!-- <van-image :src="user.avatar" :style="{ opacity: 0.5 }" /> -->
        <div
          class="user-container"
          :style="{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${user.avatar})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }"
          @click="router.push(`/user/${user.id}`)"
        >
          <div class="user-info">
            <h1>{{ user.username }}</h1>
            <p>性别： {{ user.gender ? user.gender : '未填写' }}</p>
            <p>年龄： {{ user.age ? user.age : '未填写' }}</p>
            <p>所在城市： {{ user.city }}</p>
            <p>培养单位： {{ user.institute ? user.institute : '未填写' }}</p>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>

    <div class="footer">
      <van-button icon="setting" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMeetStore } from '@/stores/meet'
import { useRouter } from 'vue-router'

const router = useRouter()

const meetStore = useMeetStore()
try {
  await meetStore.getUserList()
} catch (e) {
  console.log(e)
}
</script>

<style lang="scss" scoped>
.meet {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .swipe {
    width: 100%;
    height: 80%;

    .user-container {
      position: relative;
      width: 100%;
      height: 100%;

      .user-info {
        padding: 10px;
        position: absolute;
        bottom: 0;
      }
    }
  }
  .footer {
    text-align: center;
  }
}
</style>
