<template>
  <back-nav-bar title="喜欢我的人" />
  <loading-card v-if="loading" />
  <div class="liked-by-view" v-else>
    <van-empty v-if="!meetStore.likeUserList.length" description="暂无喜欢我的人" />
    <user-list
      v-else
      :user-list="meetStore.likedByUserList"
      @item-clicked="(userId: string) => router.push(`user/${userId}`)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { useMeetStore } from '@/stores/meet'

const router = useRouter()
const route = useRoute()
const meetStore = useMeetStore()

const loading = ref(false)

const scrollHeightStack: number[] = []

const fetchUsers = async () => {
  try {
    loading.value = true
    await meetStore.getLikedByUserList()
  } catch (_) {
    /* empty */
  } finally {
    loading.value = false
  }
}

onActivated(() => {
  const from = route.meta.from?.path
  if (!router.options.history.state.forward || from === '/') {
    fetchUsers()
  } else {
    window.scrollTo({ top: scrollHeightStack.pop() ?? 0 })
  }
})

onBeforeRouteLeave(() => {
  scrollHeightStack.push(document.body.scrollHeight)
})
</script>

<style scoped lang="scss"></style>
