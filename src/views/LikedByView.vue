<template>
  <van-nav-bar
    left-arrow
    title="喜欢我的人"
    @click-left="router.back()"
    :border="false"
    safe-area-inset-top
  />
  <van-loading v-if="loading" />
  <div class="liked-by-view" v-else>
    <div class="liked-by-view-body">
      <div class="user-list">
        <user-list
          :user-list="users"
          @item-clicked="(userId: string) => router.push(`user/${userId}`)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@/types/User'

import { ref } from 'vue'

import meetApi from '@/api/meet'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { onActivated } from 'vue'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const users = ref<User[]>([])

const loading = ref(false)

const scrollHeightStack: number[] = []

const fetchUsers = async () => {
  try {
    loading.value = true
    const res = await meetApi.getWhoLikeMe()
    users.value = res.data.data.likedBy
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
