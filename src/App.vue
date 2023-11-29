<script setup lang="ts">
import socket from '@/socket'
import { useMessageStore } from './stores/message'

socket.off()
const messageStore = useMessageStore()
messageStore.bindEvents()
</script>

<template>
  <van-config-provider theme="dark" />
  <router-view v-slot="{ Component, route }">
    <template v-if="Component">
      <keep-alive exclude="LoginView, RegisterView">
        <suspense>
          <component
            :is="Component"
            :key="
              route.name === 'meet' ||
              route.name === 'chat' ||
              route.name === 'post' ||
              route.name === 'home'
                ? 'MainLayout'
                : route.fullPath
            "
          />
          <template #fallback>
            <div class="loading">
              <van-loading type="spinner" size="30px" />
            </div>
          </template>
        </suspense>
      </keep-alive>
    </template>
  </router-view>
</template>

<style lang="scss" scoped>
.loading {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
