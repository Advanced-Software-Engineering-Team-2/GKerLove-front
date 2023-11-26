<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <back-nav-bar title="404" />
  <div class="not-found">
    <div class="wrapper">
      <h1>页面不存在</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, _, next) => {
  if (to.name === 'postDetail') {
    next('/post')
  } else {
    next()
  }
})
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
