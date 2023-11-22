<template>
  <div class="meet">
    <van-swipe
      class="swipe"
      lazy-render
      :show-indicators="false"
      :initial-swipe="initialSwipeIndex"
      @change="onSwipe"
    >
      <van-swipe-item v-for="user in meetStore.userList" :key="user.id">
        <user-card :user="user" class="user-card" @click="router.push(`/user/${user.id}`)" />
      </van-swipe-item>
    </van-swipe>

    <div class="footer">
      <van-button icon="setting" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMeetStore } from '@/stores/meet'
import { watch } from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

console.log('set up in meet')

const router = useRouter()
const route = useRoute()

let lastSwipeIndex = 0
const initialSwipeIndex = ref(lastSwipeIndex)

const meetStore = useMeetStore()
try {
  await meetStore.getUserList()
} catch (e) {
  console.log(e)
}

// watch(route, () => {
//   if (route.name === 'meet') {
//     initialSwipeIndex.value = lastSwipeIndex
//   }
// })

const onSwipe = (index: number) => {
  lastSwipeIndex = index
}
</script>

<style lang="scss" scoped>
.meet {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .swipe {
    height: 80%;

    .user-card {
      height: 100%;
    }
  }
  .footer {
    text-align: center;
  }
}
</style>
