<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="not-found">
    <van-nav-bar
      left-arrow
      @click-left="router.back()"
      title="404"
      :border="false"
      safe-area-inset-top
    />
    <div class="wrapper">
      <h1>页面不存在</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped lang="scss">
.not-found {
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    h1 {
      font-size: 3rem;
    }
  }
}
</style>
