<template>
  <van-sticky>
    <van-nav-bar
      left-arrow
      :title="props.title"
      @click-left="router.back()"
      :border="false"
      safe-area-inset-top
    />
  </van-sticky>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title: string
}>()

const router = useRouter()
</script>
