<template>
  <van-sticky>
    <back-nav-bar :title="session?.isPeerTyping ? '对方正在输入...' : '聊天'" />
  </van-sticky>

  <div class="chat-window" v-if="session">
    <div class="message-list">
      <Message
        v-for="(message, index) in session.messages"
        :key="message._id"
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
        @image-loaded="handleImageLoaded"
        @disappearing-image-clicked="showDisappearingImage"
        class="message"
      />
    </div>
    <van-sticky>
      <van-field
        class="user-input"
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
            @click="showBottom = true"
          />
          <van-button size="small" type="primary" @click="handleSendButtonClicked">发送</van-button>
        </template>
      </van-field>
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
              v-model="disappearingImageList"
              :after-read="afterReadDisapperingImage"
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
import type { Message, messageType } from '@/types/Message'
import { nextTick, onActivated, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { User } from '@/types/User'
import { onBeforeRouteLeave } from 'vue-router'
import { UploaderFileListItem } from 'vant'
import { v4 as uuidv4 } from 'uuid'
import type { IClientToServerMessage } from '@/types/socket.io.ts'

const userStore = useUserStore()
const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const session = ref<Session>()
const content = ref('')
const me = userStore.me as User

const showBottom = ref(false)
const imageList = ref([])
const disappearingImageList = ref([])
const showPreview = ref(false)
const previewImages = ref<string[]>([])

const handleImageLoaded = () => {
  window.scrollTo({ top: document.body.scrollHeight })
}

const showImage = (message: Message) => {
  if (message.type === 'image') {
    previewImages.value = [message.content]
    showPreview.value = true
  }
}

const showDisappearingImage = async (message: Message) => {
  if (!session.value) return
  if (message.type === 'disappearing') {
    if (message.senderId !== me.id) {
      try {
        await messageStore.viewDisappearingImage(session.value, message)
        previewImages.value = [message.content]
        showPreview.value = true
        setTimeout(() => {
          showPreview.value = false
        }, 1000)
      } catch (err) {
        if (typeof err === 'string') showError(err)
        else showError('查看失败')
      }
    } else {
      previewImages.value = [message.content]
      showPreview.value = true
    }
  }
}

const uploadImage = async (file: UploaderFileListItem) => {
  if (!session.value || !userStore.OSSUtil) return
  file.status = 'uploading'
  file.message = '上传中'
  try {
    const uuid = uuidv4()
    const res = await userStore.OSSUtil.put(
      `${me.username}/messages/${session.value.id}/${uuid}`,
      file.file,
      {
        timeout: 20000,
        headers: {
          'Cache-Control': 'max-age=8640000'
        }
      }
    )
    file.status = 'done'
    file.message = '上传成功'
    return res.url
  } catch (_) {
    file.status = 'failed'
    file.message = '上传失败'
  }
  return ''
}

const afterReadImage = async (file: UploaderFileListItem | UploaderFileListItem[]) => {
  if (Array.isArray(file)) file = file[0]
  const url = await uploadImage(file)
  if (url) {
    const res = await sendMessage(url, 'image')
    if (res) {
      imageList.value = []
      showBottom.value = false
    }
  }
}

const afterReadDisapperingImage = async (file: UploaderFileListItem | UploaderFileListItem[]) => {
  if (Array.isArray(file)) file = file[0]
  const url = await uploadImage(file)
  if (url) {
    const res = await sendMessage(url, 'disappearing')
    if (res) {
      disappearingImageList.value = []
      showBottom.value = false
    }
  }
}

const sendMessage = async (content: string, type: messageType) => {
  if (!session.value) return false
  const message: IClientToServerMessage = {
    content,
    recipientId: session.value.peer.id,
    type,
    timestamp: new Date().toISOString()
  }
  try {
    await messageStore.sendMessage(session.value, message)
    return true
  } catch (err) {
    if (typeof err === 'string') showError(err)
    else showError('发送失败')
  }
  return false
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
  if (content.value.trim() === '') return
  const res = await sendMessage(content.value, 'text')
  if (res) content.value = ''
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
    } else {
      try {
        const s = await messageStore.createSession(recipientId)
        session.value = s
      } catch (_) {
        router.push({
          name: '404'
        })
        return
      }
    }
    nextTick(() => {
      window.scrollTo({ top: document.body.scrollHeight })
    })
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
  .message-list {
    min-height: calc(100vh - var(--height-navbar) - 100px);
  }
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
