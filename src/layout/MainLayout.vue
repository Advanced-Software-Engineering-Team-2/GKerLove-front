<template>
  <nav-bar :title="title" class="navbar van-safe-area-top" />
  <div class="content">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <van-tabbar v-model="active" route :border="false" class="tabbar van-safe-area-bottom">
    <van-tabbar-item name="meet" to="/meet" :icon="active === 'meet' ? 'like' : 'like-o'" />
    <van-tabbar-item
      name="message"
      to="/message"
      :icon="active === 'message' ? 'chat' : 'chat-o'"
    />
    <van-tabbar-item name="home" to="/home" :icon="active === 'home' ? 'user' : 'user-o'" />
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/shared/components/NavBar.vue'
import { computed } from 'vue'

const route = useRoute()
const routeName = route.name?.toString()
const active = ref(routeName || 'meet')
const title = computed(() => {
  switch (active.value) {
    case 'meet':
      return '遇见'
    case 'message':
      return '消息'
    case 'home':
      return '我的'
    default:
      return '导航'
  }
})
</script>

<style scoped lang="scss">
.content {
  height: calc(100vh - var(--height-navbar) - var(--height-tabbar));
  overflow: auto;
  // background-color: gray;
}
</style>
