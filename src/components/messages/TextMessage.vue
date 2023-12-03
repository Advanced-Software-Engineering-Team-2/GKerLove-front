<template>
  <div class="text-message">
    <p class="text-message-content" v-html="message.content" />
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

<style scoped lang="scss">
.text-message-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
}
</style>
