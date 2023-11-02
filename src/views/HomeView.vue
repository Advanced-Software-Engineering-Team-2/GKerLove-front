<template>
  <div class="home">
    <p>用户名: {{ user.username }}</p>
    <div style="margin: 16px; display: flex; justify-content: space-between">
        <van-button color="red" round block type="primary" @click="handleLogoutButtonClicked"> 退出登录 </van-button>
      </div>
  </div>
</template>

<script setup lang="ts">

import router from '@/router';
import { useUser } from '@/stores/user'
import { showSuccess } from '@/utils/show';
import { ref } from 'vue'

const user = useUser()
const captcha = ref('')
const baseUrl = import.meta.env.VITE_API_URL
const captchaImgUrl = ref(baseUrl + '/common/captcha?timestamp=' + new Date().getTime())
user.getInfo()

const refreshCaptcha = () => {
  captchaImgUrl.value = baseUrl + '/common/captcha?timestamp=' + new Date().getTime()
}

const handleLogoutButtonClicked = async () => {
  try {
    await user.resetToken()
    showSuccess('退出登录成功')
    router.push('/login')
  } catch (_) {
    captcha.value = ''
    refreshCaptcha()
  }
}
</script>

<style scoped lang="scss"></style>
