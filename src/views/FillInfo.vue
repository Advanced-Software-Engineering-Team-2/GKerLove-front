<template>
  <div class="fillinfo">
  <h2 class="form-title">填写详细信息</h2>
    <van-form>
      <van-cell-group inset>
        <van-field v-model="avatar"  label="用户头像" placeholder="用户头像" center />
        <van-field v-model="nickname"  label="昵称" placeholder="昵称" center />
        <van-field v-model="gender"  label="用户性别" placeholder="用户性别" center />
        <van-field v-model="age"  label="用户年龄" placeholder="用户年龄" center />
        <van-field v-model="city"  label="常住城市" placeholder="常住城市" center />
        <van-field v-model="institute"  label="培养单位" placeholder="培养单位" center />
        <van-field v-model="major"  label="培养专业" placeholder="培养专业" center />
        <van-field v-model="introduction"  label="自我介绍" placeholder="自我介绍" center />
      </van-cell-group>
      <div style="margin: 16px; display: flex; justify-content: space-between">
        <van-button color="blue" round block type="primary" @click="handleSubmitButtonClicked"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/stores/user'
import { useAboutme } from '@/stores/aboutme'
import { showError,showSuccess } from '@/utils/show'


const router = useRouter()
const user = useUser()
user.getInfo()
const about = useAboutme()


const avatar = ref('')
const nickname = ref('')
const gender = ref('')
const age = ref('')
const city = ref('')
const institute = ref('')
const major = ref('')
const introduction = ref('')


const handleSubmitButtonClicked = async () => {
  if (!avatar.value || 
      !nickname.value || 
      !gender.value || 
      !age.value || 
      !city.value || 
      !institute.value || 
      !major.value || 
      !introduction.value) {
    showError('请检查输入是否完整')
    return
  }
  try {
    await about.setabout(user.username,nickname.value,avatar.value,gender.value,age.value,city.value,institute.value,major.value,introduction.value)
    showSuccess('成功提交表单')
    router.push('/')
  } catch (_) {

  }
}
</script>



<style scoped>
.fillinfo {
  width: 100%;
  margin-top: 3rem;
}

.form-title {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 1rem;
}
</style>

