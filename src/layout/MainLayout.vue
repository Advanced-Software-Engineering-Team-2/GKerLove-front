<template>
  <router-view />
  <van-tabbar v-model="active" route :border="false">
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

const route = useRoute()
const active = ref(route.name?.toString() || 'meet')
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
