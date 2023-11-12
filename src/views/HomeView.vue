<template>
  <div class="home">
    <user-card class="user-card"/>
    
    <div style="margin: 16px">
      <van-button color="red" round block type="primary" @click="handleLogoutButtonClicked">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserCard from '@/components/UserCard.vue'

import router from '@/router'
import { useUser } from '@/stores/user'
import { showSuccess } from '@/utils/show'

const user = useUser()

const handleLogoutButtonClicked = async () => {
  try {
    showSuccess('退出登录成功')
    router.push('/login')
    await user.resetToken()
  } catch (_) {
    /* empty */
  }
}
</script>

<style scoped lang="scss">
</style>
