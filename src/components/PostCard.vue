<template>
  <div class="post-card">
    <post-card-header class="header" :post="post">
      <template v-slot:left v-if="fromMe">
        <div class="time" style="display: flex; justify-content: center; align-items: center">
          {{ formattedTime }}
        </div>
      </template>
      <template v-slot:right>
        <van-button
          size="small"
          type="danger"
          v-if="fromMe"
          @click="$emit('delete-button-clicked')"
        >
          删除
        </van-button>
      </template>
    </post-card-header>

    <div class="body" @click="$emit('body-clicked')">
      <div class="content">{{ post.content }}</div>

      <div class="image-container">
        <van-image v-for="image in post.imageList" :key="image" :src="image" lazy-load />
      </div>

      <div class="footer">评论数量: {{ post.commentCnt }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import moment from 'moment'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  post: Post
  fromMe?: boolean
}>()

const { post, fromMe } = toRefs(props)

const formattedTime = computed(() => {
  return moment(post.value.time).format('MM月DD日 HH:mm')
})
</script>

<style scoped lang="scss">
.post-card {
  .content {
    padding: 15px 0;
  }
  .image-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 15px;
  }
}

.footer {
  font-size: 0.8rem;
}
</style>
