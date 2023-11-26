<template>
  <back-nav-bar title="喜欢的人" />
  <loading-card v-if="loading" />
  <div class="likes-view" v-else>
    <div class="likes-view-body">
      <div class="user-list">
        <user-list
          :user-list="meetStore.likeUserList"
          @item-clicked="(userId: string) => router.push(`user/${userId}`)"
        />
      </div>
    </div>
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
    await meetStore.getLikeUserList()
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
