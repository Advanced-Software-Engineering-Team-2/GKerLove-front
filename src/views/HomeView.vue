<template>
  <div class="home">
    <p>用户名: {{ user.username }}</p>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/stores/user'

const user = useUser()

</script>

<style scoped lang="scss"></style>
