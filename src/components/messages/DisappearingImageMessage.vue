<template>
  <div class="disappearing-image-message">
    <van-image
      class="disappearing-image-message-content"
      src="https://gker-love.oss-cn-beijing.aliyuncs.com/fire.jpg"
      width="40vw"
      @load="$emit('image-loaded')"
      @click="$emit('disappearing-image-clicked')"
    />
  </div>
</template>

<script setup lang="ts"></script>
