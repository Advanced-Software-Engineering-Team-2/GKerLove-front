<!-- 完善信息页面，允许用户不填任何信息 -->
<template>
  <div class="update-info">
    <van-nav-bar
      title="完善信息"
      left-arrow
      @click-left="onClickBack"
      :border="false"
      safe-area-inset-top
    />
    <van-form>
      <van-cell-group inset>
        <van-field label="头像" placeholder="头像" center>
          <template #input>
            <van-config-provider
              :theme-vars="{
                uploaderBorderRadius: '40px',
                paddingXs: '0'
              }"
            >
              <van-uploader
                v-model="avatarFiles"
                :after-read="afterReadAvatar"
                :max-count="1"
                :max-size="10 * 1024 * 1024"
                reupload
                :deletable="false"
              />
            </van-config-provider>
          </template>
        </van-field>
        <van-field label="性别" placeholder="性别" center>
          <template #input>
            <van-radio-group v-model="gender" direction="horizontal">
              <van-radio name="男">男</van-radio>
              <van-radio name="女">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="age"
          label="年龄"
          placeholder="年龄"
          type="digit"
          :rules="[
            { validator: (age: number) => age >= 0 && age <= 200, message: '请输入正确的年龄' }
          ]"
          center
        />
        <van-field
          v-model="city"
          is-link
          readonly
          label="所在城市"
          placeholder="所在城市"
          @click="showCityPicker = true"
          center
        />
        <van-popup v-model:show="showCityPicker" round position="bottom">
          <van-picker
            :columns="cityPickerColumns"
            @cancel="showCityPicker = false"
            @confirm="
              (selectedOptions) => {
                showCityPicker = false
                city = selectedOptions.selectedValues[1]
              }
            "
          />
        </van-popup>
        <van-field
          v-model="institute"
          is-link
          readonly
          label="培养单位"
          placeholder="培养单位"
          @click="showInstitutePicker = true"
          center
        />
        <van-popup v-model:show="showInstitutePicker" round position="bottom">
          <van-picker
            :columns="institutePickerColumns"
            @cancel="showInstitutePicker = false"
            @confirm="
              (selectedOptions) => {
                showInstitutePicker = false
                institute = selectedOptions.selectedValues[0]
              }
            "
          />
        </van-popup>
        <van-field
          v-model="introduction"
          rows="3"
          autosize
          label="自我介绍"
          type="textarea"
          maxlength="50"
          placeholder="自我介绍"
          show-word-limit
          center
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button color="blue" round block type="primary" @click="handleSubmitButtonClicked">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import cityList from '@/constants/city'
import instituteList from '@/constants/institute'
import { v4 as uuidv4 } from 'uuid'

import type { UploaderFileListItem } from 'vant'

const cityPickerColumns = Object.keys(cityList).map((province) => {
  return {
    text: province,
    value: province,
    children: cityList[province].map((city) => {
      return {
        text: city,
        value: city
      }
    })
  }
})

const institutePickerColumns = instituteList.map((institute) => {
  return {
    text: institute,
    value: institute
  }
})

const showCityPicker = ref(false)
const showInstitutePicker = ref(false)

const router = useRouter()
const user = useUserStore()

const avatarFiles = ref<UploaderFileListItem[]>([
  {
    url: user.avatar,
    isImage: true
  }
])
let avatar = user.avatar
const gender = ref(user.gender)
const age = ref(user.age)
const city = ref(user.city)
const institute = ref(user.institute)
const introduction = ref(user.introduction)

const afterReadAvatar = async (file: UploaderFileListItem | UploaderFileListItem[]) => {
  if (Array.isArray(file)) {
    file = file[0]
  }
  file.status = 'uploading'
  file.message = '上传中'
  const uuid = uuidv4()
  try {
    const res = await user.OSSUtil?.put(`${user.username}/${uuid}`, file.file, {
      // 对于用户头像，可能会修改，因此设置缓存策略为no-cache（默认），每次先去服务器判断是否修改过（304）
      // headers: {
      //   'Cache-Control': 'max-age=86400'
      // },
      timeout: 5000
    })
    avatar = res!.url
  } catch (_) {
    file.status = 'failed'
    file.message = '上传失败'
    return
  }
  file.status = 'done'
  file.message = '上传成功'
}

const handleSubmitButtonClicked = async () => {
  try {
    await user.updateInfo({
      avatar,
      gender: gender.value,
      age: age.value,
      city: city.value,
      institute: institute.value,
      introduction: introduction.value
    })
    router.push({
      name: 'home'
    })
  } catch (_) {
    /* empty */
  }
}

const onClickBack = () => {
  router.back()
}
</script>

<style scoped>
.update-info {
  width: 100%;
}

.form-title {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 1rem;
}
</style>
