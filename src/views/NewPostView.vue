<!-- 发布动态页面 -->
<template>
  <back-nav-bar title="发布动态" />
  <div class="new-post">
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
              :max-count="1"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UploaderFileListItem } from 'vant'
import { v4 as uuidv4 } from 'uuid'

import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'

const router = useRouter()
const user = useUserStore()
const postStore = usePostStore()

const content = ref('')
const imageList = ref([])
let imageUrls: string[] = []

const afterReadImage = async (files: UploaderFileListItem | UploaderFileListItem[]) => {
  if (!Array.isArray(files)) {
    files = [files]
  }
  for (const file of files) {
    file.status = 'uploading'
    file.message = '上传中'
    try {
      const uuid = uuidv4()
      const res = await user.OSSUtil?.put(`${user.username}/posts/${uuid}`, file.file, {
        timeout: 5000,
        // 对于动态图片，不会被修改，因此缓存时间可以设置的很长
        headers: {
          'Cache-Control': 'max-age=8640000'
        }
      })
      file.status = 'done'
      file.message = '上传成功'
      imageUrls.push(res!.url)
    } catch (_) {
      file.status = 'failed'
      file.message = '上传失败'
    }
  }
}

const handleSubmitButtonClicked = async () => {
  try {
    await postStore.addPost(content.value, imageUrls)
    content.value = ''
    imageList.value = []
    imageUrls = []
    router.push({
      name: 'home'
    })
  } catch (_) {
    /* empty */
  }
}
</script>

<style scoped lang="scss"></style>
