<template>
  <div class="meet">
    <loading-card v-if="loading" />
    <van-swipe class="swipe" lazy-render :show-indicators="false" v-else>
      <van-swipe-item v-for="user in meetStore.userList" :key="user.id">
        <user-card :user="user" class="user-card" @click="router.push(`/user/${user.id}`)" />
      </van-swipe-item>
    </van-swipe>

    <div class="footer">
      <van-button icon="setting" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMeetStore } from '@/stores/meet'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const meetStore = useMeetStore()
const loading = ref(false)

const getUserList = async () => {
  loading.value = true
  await meetStore.getUserList()
  loading.value = false
}

getUserList()
</script>

<style lang="scss" scoped>
.meet {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .swipe {
    height: 80%;

    .user-card {
      height: 100%;
    }
  }
  .footer {
    text-align: center;
  }
}
</style>
