<template>
  <loading-card v-if="loading" />
  <div class="meet-view" v-else>
    <van-swipe class="swipe" lazy-render :show-indicators="false">
      <van-swipe-item v-for="user in users" :key="user.id">
        <user-card :user="user" class="user-card" @click="router.push(`/user/${user.id}`)" />
      </van-swipe-item>
    </van-swipe>
    <div class="footer">
      <van-button icon="setting" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@/types/User'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import meetApi from '@/api/meet'

const router = useRouter()

const users = ref<User[]>([])

const loading = ref(false)
const gender = ref<string>()
const minAge = ref<number>()
const maxAge = ref<number>()
const city = ref<string>()
const institute = ref<string>()

const getUsers = async () => {
  loading.value = true
  try {
    const res = await meetApi.getUserList(
      gender.value,
      minAge.value,
      maxAge.value,
      city.value,
      institute.value
    )
    users.value = res.data.data.userList
  } catch (_) {
    /* empty */
  } finally {
    loading.value = false
  }
}

getUsers()
</script>

<style lang="scss" scoped>
.meet-view {
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
