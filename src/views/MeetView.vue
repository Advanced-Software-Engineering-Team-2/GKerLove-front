<template>
  <loading-card v-if="loading" />
  <div class="meet-view" v-else>
    <van-empty description="没有满足条件的用户" image-size="8rem" v-if="!users.length" />
    <van-swipe class="swipe" lazy-render :show-indicators="false" v-else>
      <van-swipe-item v-for="user in users" :key="user.id">
        <user-card :user="user" class="user-card" @click="router.push(`/user/${user.id}`)" />
      </van-swipe-item>
    </van-swipe>
    <div class="footer">
      <van-button type="success" @click="getUsers()"> 换一批 </van-button>
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

  .swipe {
    height: 80%;

    .user-card {
      height: 100%;
    }
  }
  .footer {
    margin-top: 25px;
    text-align: center;
  }
}
</style>
