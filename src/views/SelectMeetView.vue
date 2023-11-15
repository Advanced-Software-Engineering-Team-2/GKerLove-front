<!-- 遇见页面筛选条件，允许用户不填任何信息 -->
<template>
  <div class="update-info">
    <van-nav-bar
      title="筛选条件"
      left-arrow
      @click-left="onClickBack"
      :border="false"
      safe-area-inset-top
    />
    <van-form>
      <van-cell-group inset>
        <van-field label="性别" placeholder="性别" center>
          <template #input>
            <van-radio-group v-model="gender" direction="horizontal">
              <van-radio name="男">男</van-radio>
              <van-radio name="女">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="min_age"
          label="最小年龄"
          placeholder="最小年龄"
          type="digit"
          :rules="[
            {
              validator: (min_age: number) => min_age >= 0 && min_age <= 200,
              message: '请输入正确的年龄'
            }
          ]"
          center
        />
        <van-field
          v-model="max_age"
          label="最大年龄"
          placeholder="最大年龄"
          type="digit"
          :rules="[
            {
              validator: (max_age: number) => max_age >= 0 && max_age <= 200,
              message: '请输入正确的年龄'
            }
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
      </van-cell-group>
      <div style="margin: 16px">
        <van-button color="blue" round block type="primary" @click="handleSubmitButtonClicked">
          确认筛选
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useMeet } from '@/stores/meet'
import { useRouter } from 'vue-router'
import cityList from '@/constants/city'
import instituteList from '@/constants/institute'

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
const meet = useMeet()

const gender = ref('')
const min_age = ref()
const max_age = ref()
const city = ref('')
const institute = ref('')

const handleSubmitButtonClicked = async () => {
  if (!min_age.value) {
    min_age.value = 0
  }
  if (!max_age.value) {
    max_age.value = 0
  }
  try {
    await meet.getList(
      user.username,
      gender.value,
      min_age.value,
      max_age.value,
      city.value,
      institute.value
    )
    router.push('/meet')
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
