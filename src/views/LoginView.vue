<template>
  <div class="login-view">
    <h2 class="form-title">登录</h2>
    <van-form>
      <van-cell-group inset>
        <van-field v-model="username" label="用户名" placeholder="用户名" center />
        <van-field v-model="password" type="password" label="密码" placeholder="密码" center />
        <van-field v-model="captcha" label="验证码" placeholder="验证码" center>
          <template #extra>
            <img
              :src="captchaImgUrl"
              alt="验证码"
              @click="refreshCaptcha"
              style="cursor: pointer; margin-left: 10px"
            />
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px; display: flex; justify-content: space-between">
        <van-button round block type="primary" @click="handleLoginButtonClicked"> 登录 </van-button>
        <van-button
          round
          block
          type="success"
          @click="
            $router.push({
              name: 'register'
            })
          "
          style="margin-left: 2rem"
        >
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showError } from '@/utils/show'

const baseUrl = import.meta.env.VITE_API_URL

const router = useRouter()
const user = useUserStore()
const username = ref('')
const password = ref('')
const captcha = ref('')
const captchaImgUrl = ref(baseUrl + '/common/captcha?timestamp=' + new Date().getTime())

const refreshCaptcha = () => {
  captchaImgUrl.value = baseUrl + '/common/captcha?timestamp=' + new Date().getTime()
}

const handleLoginButtonClicked = async () => {
  // 检查字段是否都填写
  if (!username.value || !password.value || !captcha.value) {
    showError('请检查输入是否完整')
    return
  }
  // 用户名长度校验
  if (username.value.length < 4 || username.value.length > 20) {
    showError('用户名或密码错误')
    return
  }
  // 密码长度校验
  if (password.value.length < 6 || password.value.length > 20) {
    showError('用户名或密码错误')
    return
  }
  if (captcha.value.length !== 4) {
    showError('验证码错误')
    return
  }
  try {
    await user.login(username.value, password.value, captcha.value)

    router.replace('/')
  } catch (_) {
    // 登录失败
    captcha.value = ''
    refreshCaptcha()
  }
}
</script>

<style scoped>
.login-view {
  width: 100%;
  padding-top: 3rem;
}

.form-title {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 1rem;
}
</style>
