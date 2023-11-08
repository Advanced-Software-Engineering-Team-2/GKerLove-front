<template>
  <div class="home">
    <p>用户名: {{ user.username }}</p>
    <p>昵称: {{ about.nickname }}</p>
    <p>头像: {{ about.avatar }}</p>
    <p>性别: {{ about.gender }}</p>
    <p>年龄: {{ about.age }}</p>
    <p>常住城市: {{ about.city }}</p>
    <p>培养单位: {{ about.institute }}</p>
    <p>专业: {{ about.major }}</p>
    <p>自我介绍: {{ about.introduction }}</p>
    <div style="margin: 16px; display: flex; justify-content: space-between">
        <van-button color="red" round block type="primary" @click="handleLogoutButtonClicked"> 退出登录 </van-button>
      </div>
  </div>
</template>

<script setup lang="ts">

import router from '@/router';
import { useAboutme } from '@/stores/aboutme';
import { useUser } from '@/stores/user'
import { showSuccess } from '@/utils/show';

const user = useUser()


const about = useAboutme()
about.getabout(user.username)



const handleLogoutButtonClicked = async () => {
  try {
    await user.resetToken()
    showSuccess('退出登录成功')
    router.push('/login')
  } catch (_) {
  }
}
</script>

<style scoped lang="scss"></style>
