<template>
  <div class="image-message">
    <van-image
      class="image-message-content"
      :src="message.content"
      width="40vw"
      @click="$emit('image-clicked')"
      @load="$emit('image-loaded')"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@/types/Message'
import { toRefs } from 'vue'

const props = defineProps<{
  message: Message
}>()

const { message } = toRefs(props)
</script>
