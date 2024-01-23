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
      <van-button type="primary" @click="showMatchDialog = true"> 匿名匹配 </van-button>
    </div>
    <van-dialog
      v-model:show="matchStore.isMatching"
      show-cancel-button
      :show-confirm-button="false"
      :before-close="beforeMatchDialogClose"
    >
      <div class="matching"><span>正在匹配：</span> <van-loading /></div>
    </van-dialog>

    <van-dialog v-model:show="showMatchDialog">
      <template #default>
        <div style="padding: 20px">
          <div>
            <span>只和异性匹配：</span>
            <van-switch v-model="matchCondition.diffGender" />
          </div>
          <div>
            <span>不和之前匹配过的人匹配：</span>
            <van-switch v-model="matchCondition.noPreviousMatch" />
          </div>
        </div>
      </template>
      <template #footer>
        <div style="display: flex; justify-content: space-between; padding: 20px">
          <van-button round block type="primary" size="small" @click="handleMatchClicked">
            开始匹配
          </van-button>
          <van-button
            round
            block
            size="small"
            type="danger"
            @click="showMatchDialog = false"
            style="margin-left: 20px"
          >
            取消
          </van-button>
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useMeetStore } from '@/stores/meet'
import { useMatchStore } from '@/stores/match'
import { showError } from '@/utils/show'

const router = useRouter()
const meetStore = useMeetStore()
const matchStore = useMatchStore()

const loading = ref(false)
const gender = ref<string>()
const minAge = ref<number>()
const maxAge = ref<number>()
const city = ref<string>()
const institute = ref<string>()
const matchCondition = ref({
  diffGender: false,
  noPreviousMatch: false
})
const showMatchDialog = ref(false)

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
    await matchStore.matchCancel()
    return true
  } catch (_) {
    return false
  }
}
const handleMatchClicked = async () => {
  try {
    await matchStore.matchRequest(matchCondition.value)
    showMatchDialog.value = false
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
