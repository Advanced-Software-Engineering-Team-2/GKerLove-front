<template>
  <div class="register-view">
    <h2 class="form-title">注册</h2>
    <van-form>
      <van-cell-group inset>
        <van-field v-model="username" label="用户名" placeholder="用户名" center />
        <van-field v-model="password" type="password" label="密码" placeholder="密码" center />
        <van-field v-model="email" label="邮箱" placeholder="邮箱" center />
        <van-field
          v-model="code"
          name="邮箱验证码"
          label="邮箱验证码"
          placeholder="邮箱验证码"
          center
        >
          <template #button>
            <van-button
              size="small"
              :loading="timeLeft > 0"
              :loading-text="timeLeft + 's'"
              @click="handleCodeSendButtonClicked"
            >
              发送验证码
            </van-button>
          </template>
        </van-field>

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
        <van-button round block type="success" @click="handleRegisterButtonClicked">
          注册
        </van-button>
        <van-button
          round
          block
          type="primary"
          @click="$router.push('/login')"
          style="margin-left: 2rem"
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { checkEmail } from '@/utils/common'
import { showError, showSuccess } from '@/utils/show'
import userApi from '@/api/user'
import commonApi from '@/api/common'

const baseUrl = import.meta.env.VITE_API_URL

const username = ref('')
const password = ref('')
const email = ref('')
const captcha = ref('')
const code = ref('')
const timeLeft = ref(0)
const router = useRouter()

const captchaImgUrl = ref(baseUrl + '/common/captcha?timestamp=' + new Date().getTime())

const refreshCaptcha = () => {
  captchaImgUrl.value = baseUrl + '/common/captcha?timestamp=' + new Date().getTime()
}

const handleCodeSendButtonClicked = async () => {
  if (!email.value) {
    showError('邮箱为空')
    return
  }
  if (!checkEmail(email.value)) {
    showError('邮箱格式错误')
    return
  }
  timeLeft.value = 30
  try {
    await commonApi.sendCode(email.value)
    showSuccess('发送成功')
  } catch (_) {
    /* empty */
  } finally {
    const timer = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value === 0) clearInterval(timer)
    }, 1000)
  }
}

const handleRegisterButtonClicked = async () => {
  // 检查字段是否都填写
  if (!username.value || !password.value || !email.value || !code.value || !captcha.value) {
    showError('请检查输入是否完整')
    return
  }
  // 用户名长度校验
  if (username.value.length < 4 || username.value.length > 20) {
    showError('用户名长度必须在4-20之间')
    return
  }
  // 密码长度校验
  if (password.value.length < 6 || password.value.length > 20) {
    showError('密码长度必须在6-20之间')
    return
  }
  // 邮箱长度校验
  if (email.value.length > 50) {
    showError('邮箱长度不能超过50')
    return
  }
  // 邮箱格式校验
  if (!checkEmail(email.value)) {
    showError('邮箱格式错误')
    return
  }
  // 邮箱验证码长度校验
  if (code.value.length !== 6) {
    showError('邮箱验证码错误')
    return
  }
  // 图片验证码长度校验
  if (captcha.value.length !== 4) {
    showError('验证码错误')
    return
  }
  try {
    await userApi.register(username.value, password.value, email.value, captcha.value, code.value)
    showSuccess('注册成功')
    router.push('/login')
  } catch (_) {
    captcha.value = ''
    refreshCaptcha()
  }
}
</script>

<style scoped>
.register-view {
  width: 100%;
  padding-top: 3rem;
}

.form-title {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 1rem;
}
</style>
