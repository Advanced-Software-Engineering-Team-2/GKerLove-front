<template>
  <van-sticky>
    <back-nav-bar :title="session?.isPeerTyping ? '对方正在输入...' : '聊天'" />
  </van-sticky>

  <div class="chat-window" v-if="session">
    <Message
      v-for="(message, index) in session.messages"
      :key="message.id"
      :message="message"
      :author="message.senderId === session.peer.id ? session.peer : me"
      :show-time="shouldShowTime(index)"
      @avatar-clicked="
        router.push({
          name: 'userDetail',
          params: {
            id: message.senderId
          }
        })
      "
      @image-clicked="showImage"
      class="message"
    />

    <van-sticky position="bottom">
      <div class="footer">
        <van-field
          v-model="content"
          type="textarea"
          maxlength="50"
          show-word-limit
          @focus="messageStore.startTyping(session)"
          @blur="messageStore.stopTyping(session)"
        >
          <template #button>
            <van-button
              icon="plus"
              round
              size="small"
              style="margin-right: 10px"
              @click="handlePlusButtonClicked"
            />
            <van-button size="small" type="primary" @click="handleSendButtonClicked"
              >发送</van-button
            >
          </template>
        </van-field>
      </div>
    </van-sticky>
    <van-popup v-model:show="showBottom" position="bottom">
      <div class="pop-up">
        <div class="item">
          <h3 class="item-title">图片</h3>
          <van-config-provider
            :theme-vars="{
              paddingXs: '0'
            }"
          >
            <van-uploader
              class="picture-uploader"
              v-model="imageList"
              :after-read="afterReadImage"
              :max-count="1"
              :max-size="10 * 1024 * 1024"
            />
          </van-config-provider>
        </div>
        <div class="item">
          <h3 class="item-title">闪图</h3>
          <van-config-provider
            :theme-vars="{
              paddingXs: '0'
            }"
          >
            <van-uploader
              class="picture-uploader"
              v-model="imageList"
              :after-read="afterReadImage"
              :max-count="1"
              :max-size="10 * 1024 * 1024"
            />
          </van-config-provider>
        </div>
      </div>
    </van-popup>
    <van-image-preview v-model:show="showPreview" :images="previewImages" :show-index="false" />
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { useMessageStore } from '@/stores/message'
import { useUserStore } from '@/stores/user'
import { Session } from '@/types/Session'
import { showError } from '@/utils/show'
import type { Message } from '@/types/Message'
import { nextTick, onActivated, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { User } from '@/types/User'
import { onBeforeRouteLeave } from 'vue-router'
import { UploaderFileListItem } from 'vant'
import { v4 as uuidv4 } from 'uuid'

const userStore = useUserStore()
const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const session = ref<Session>()
const content = ref('')
const me = userStore.me as User

const showBottom = ref(false)
const imageList = ref([])
const showPreview = ref(false)
const previewImages = ref<string[]>([])

const showImage = (message: Message) => {
  if (message.type === 'image') {
    previewImages.value = [message.content]
    showPreview.value = true
  }
}

const handlePlusButtonClicked = () => {
  showBottom.value = true
}

const afterReadImage = async (files: UploaderFileListItem | UploaderFileListItem[]) => {
  if (!session.value || !userStore.OSSUtil) return
  if (!Array.isArray(files)) {
    files = [files]
  }
  for (const file of files) {
    file.status = 'uploading'
    file.message = '上传中'
    try {
      const uuid = uuidv4()
      const res = await userStore.OSSUtil.put(
        `${me.username}/messages/${session.value.id}/${uuid}`,
        file.file,
        {
          timeout: 5000,
          headers: {
            'Cache-Control': 'max-age=8640000'
          }
        }
      )
      file.status = 'done'
      file.message = '上传成功'
      const message: Message = {
        id: '',
        content: res.url,
        senderId: me.id,
        recipientId: session.value.peer.id,
        type: 'image',
        timestamp: new Date().toISOString()
      }
      await messageStore.sendMessage(session.value, message)
      imageList.value = []
      showBottom.value = false
      nextTick(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      })
    } catch (_) {
      file.status = 'failed'
      file.message = '上传失败'
    }
  }
}

const shouldShowTime = (index: number) => {
  if (!session.value) return false
  if (index == 0) return true
  const currentMessageTime = moment(session.value.messages[index].timestamp)
  const prevMessageTime = moment(session.value.messages[index - 1].timestamp)
  const diffMinutes = currentMessageTime.diff(prevMessageTime, 'minutes')
  return diffMinutes >= 5
}

const handleSendButtonClicked = async () => {
  if (!session.value) {
    showError('会话不存在')
    return
  }
  if (!me) {
    showError('未登录')
    return
  }
  if (content.value.trim() === '') {
    return
  }
  const message: Message = {
    id: '',
    content: content.value,
    senderId: me.id,
    recipientId: session.value.peer.id,
    type: 'text',
    timestamp: new Date().toISOString()
  }
  await messageStore.sendMessage(session.value, message)
  content.value = ''
  nextTick(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  })
}

onActivated(async () => {
  const recipientId = route.params.id
  if (!recipientId || Array.isArray(recipientId)) {
    router.push({
      name: '404'
    })
  } else {
    const s = messageStore.sessions.find((s) => s.peer.id === recipientId)
    if (s) {
      session.value = s
      nextTick(() => {
        window.scrollTo({ top: document.body.scrollHeight })
      })
    } else {
      try {
        const s = await messageStore.createSession(recipientId)
        session.value = s
        nextTick(() => {
          window.scrollTo({ top: document.body.scrollHeight })
        })
      } catch (_) {
        router.push({
          name: '404'
        })
      }
    }
  }
})

watch(
  () => session.value?.messages.length,
  () => {
    nextTick(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
  }
)

onBeforeRouteLeave(() => {
  if (session.value) {
    messageStore.readMessages(session.value)
  }
})
</script>

<style scoped lang="scss">
.chat-window {
  .message {
    margin-top: 15px;
  }

  .pop-up {
    display: flex;
    height: 200px;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    .item {
      text-align: center;
      .item-title {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
