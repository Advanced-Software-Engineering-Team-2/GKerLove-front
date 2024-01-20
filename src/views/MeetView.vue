<template>
  <loading-card v-if="loading" />
  <div class="meet-view" v-else>
    <van-empty
      description="没有满足条件的用户"
      image-size="8rem"
      v-if="!meetStore.userList.length"
    />
    <van-swipe v-else class="swipe" lazy-render :show-indicators="false" :loop="false">
      <van-swipe-item v-for="user in meetStore.userList" :key="user.id">
        <user-card :user="user" class="user-card" @click="router.push(`/user/${user.id}`)" />
      </van-swipe-item>
    </van-swipe>
    <div class="footer">
      <van-button type="success" @click="getUsers()"> 换一批 </van-button>
      <van-button type="primary" @click="handleMatchClicked"> 匹配 </van-button>
    </div>
    <van-dialog
      v-model:show="messageStore.isMatching"
      show-cancel-button
      :show-confirm-button="false"
      :before-close="beforeMatchDialogClose"
    >
      <div class="matching"><span>正在匹配：</span> <van-loading /></div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useMeetStore } from '@/stores/meet'
import { useMessageStore } from '@/stores/message'
import { showError } from '@/utils/show'

const router = useRouter()
const meetStore = useMeetStore()
const messageStore = useMessageStore()

const loading = ref(false)
const gender = ref<string>()
const minAge = ref<number>()
const maxAge = ref<number>()
const city = ref<string>()
const institute = ref<string>()

const getUsers = async () => {
  loading.value = true
  try {
    await meetStore.getUserList(
      gender.value,
      minAge.value,
      maxAge.value,
      city.value,
      institute.value
    )
  } catch (_) {
    /* empty */
  } finally {
    loading.value = false
  }
}

const beforeMatchDialogClose = async () => {
  try {
    await messageStore.matchCancel()
    return true
  } catch (_) {
    return false
  }
}
const handleMatchClicked = async () => {
  try {
    await messageStore.matchRequest()
  } catch (err) {
    if (typeof err === 'string') showError(err)
    else showError('无法匹配')
  }
}

getUsers()
</script>

<style lang="scss" scoped>
.meet-view {
  height: 100%;

  .swipe {
    height: 80%;

    .user-card {
      height: 100%;
    }
  }
  .footer {
    margin-top: 25px;
    text-align: center;
    display: flex;
    justify-content: space-evenly;
  }
  .matching {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-right: 10px;
    }
  }
}
</style>
