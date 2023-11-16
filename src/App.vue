<script setup lang="ts"></script>

<template>
  <van-config-provider theme="dark" />
  <suspense>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <template #fallback>正在加载...</template>
  </suspense>
</template>

<style scoped></style>
