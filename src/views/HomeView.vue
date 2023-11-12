<template>
  <div class="home">
    <p>用户名: {{ user.username }}</p>
    <p>性别: {{ user.info.gender ? user.info.gender : '未填写' }}</p>
    <p>年龄: {{ user.info.age ? user.info.age : '未填写' }}</p>
    <p>所在城市: {{ user.info.city ? user.info.city : '未填写' }}</p>
    <p>培养单位: {{ user.info.institute ? user.info.institute : '未填写' }}</p>
    <p>自我介绍: {{ user.info.introduction ? user.info.introduction : '未填写' }}</p>
    <div style="margin: 16px">
      <van-button color="red" round block type="primary" @click="handleLogoutButtonClicked">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
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

<style scoped lang="scss"></style>
