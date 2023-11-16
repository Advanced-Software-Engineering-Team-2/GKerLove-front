<template>
  <div class="home">
    <user-card :user="user">
      <div class="button-box">
        <van-button
          color="blue"
          round
          size="small"
          @click="router.push('/updateInfo')"
          style="margin-right: 5px"
        >
          完善信息
        </van-button>
        <van-button
          color="green"
          round
          size="small"
          @click="router.push('/newPost')"
          style="margin-right: 5px"
        >
          发布动态
        </van-button>
        <van-button color="red" round size="small" @click="handleLogoutButtonClicked">
          退出登录
        </van-button>
      </div>
    </user-card>
  </div>
</template>

<script setup lang="ts">
import UserCard from '@/components/UserCard.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { showSuccess } from '@/utils/show'
import { TUICore } from '../TUIKit'

const user = useUserStore()

const handleLogoutButtonClicked = async () => {
  try {
    const TUIins = TUICore.instance
    await TUIins.logout()
    showSuccess('退出登录成功')
    router.push('/login')
    await user.resetToken()
  } catch (_) {
    /* empty */
  }
}
</script>

<style scoped lang="scss"></style>
