<template>
  <div class="navbar">
    <span class="title">{{ props.title }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  place-items: center;
  background-color: var(--color-background);
  height: var(--height-navbar);
  font-size: var(--van-font-size-lg);

  .title {
    font-weight: var(--font-weight-navbar);
  }
}
</style>
