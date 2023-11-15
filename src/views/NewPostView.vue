<!-- 发布动态页面 -->
<template>
  <div class="new-post">
    <van-nav-bar
      title="发布动态"
      left-arrow
      @click-left="onClickBack"
      :border="false"
      safe-area-inset-top
    />
  </div>
  <van-form>
    <van-cell-group inset>
      <van-field
        v-model="content"
        rows="10"
        autosize
        label="内容"
        type="textarea"
        maxlength="200"
        placeholder="和大家交流一下想法和感受吧..."
        show-word-limit
        center
      />
      <van-field label="图片" placeholder="图片" center>
        <template #input>
          <van-uploader
            v-model="imageList"
            :after-read="afterReadImage"
            :max-count="4"
            :max-size="10 * 1024 * 1024"
          />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px">
      <van-button color="blue" round block type="primary" @click="handleSubmitButtonClicked">
        发布
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UploaderFileListItem } from 'vant'
import { v4 as uuidv4 } from 'uuid'

import { useUserStore } from '@/stores/user'
import postApi from '@/api/post'
import { showSuccess } from '@/utils/show'

const router = useRouter()
const user = useUserStore()

const content = ref('')
const imageList = ref([])
const imageIds: string[] = []

const onClickBack = () => {
  router.back()
}

const afterReadImage = async (files: UploaderFileListItem | UploaderFileListItem[]) => {
  if (!Array.isArray(files)) {
    files = [files]
  }
  for (const file of files) {
    file.status = 'uploading'
    file.message = '上传中'
    try {
      const uuid = uuidv4()
      await user.OSSUtil?.put(`${user.username}/posts/${uuid}`, file.file, {
        timeout: 5000
      })
      file.status = 'done'
      file.message = '上传成功'
      imageIds.push(uuid)
    } catch (_) {
      file.status = 'failed'
      file.message = '上传失败'
    }
  }
}

const handleSubmitButtonClicked = async () => {
  const res = await postApi.addPost(content.value, imageIds)
  showSuccess(res.data.message)
  router.push('/home')
}
</script>

<style scoped lang="scss"></style>
