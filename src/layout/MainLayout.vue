<template>
  <div class="main-layout">
    <nav-bar :title="title" class="navbar van-safe-area-top" />
    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <van-tabbar route :border="false" class="tabbar van-safe-area-bottom">
      <van-tabbar-item name="meet" to="/meet" :icon="active === 'meet' ? 'like' : 'like-o'" />
      <van-tabbar-item
        name="message"
        to="/message"
        :icon="active === 'message' ? 'chat' : 'chat-o'"
        :badge="messageStore.totalUnread"
        :badge-props="{ showZero: false }"
      />
      <van-tabbar-item name="post" to="/post" :icon="active === 'post' ? 'friends' : 'friends-o'" />
      <van-tabbar-item name="home" to="/home" :icon="active === 'home' ? 'user' : 'user-o'" />
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import NavBar from '@/shared/components/NavBar.vue'
import { computed } from 'vue'
import { useMessageStore } from '@/stores/message'

const route = useRoute()
const active = computed(() => route.name)
const title = computed(() => {
  switch (active.value) {
    case 'meet':
      return '遇见'
    case 'message':
      return '消息'
    case 'home':
      return '我的'
    case 'post':
      return '动态'
    default:
      return '导航'
  }
})
const messageStore = useMessageStore()
</script>

<style scoped lang="scss">
.loading {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  height: calc(100vh - var(--height-navbar) - var(--height-tabbar));
  overflow: auto;
  // background-color: gray;
}
</style>
