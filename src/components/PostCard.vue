<template>
  <div class="post-card">
    <post-card-header class="header" :post="post" @avatar-clicked="$emit('avatar-clicked')">
      <template v-slot:left v-if="!showUser">
        <div class="time" style="display: flex; justify-content: center; align-items: center">
          {{ formattedTime }}
        </div>
      </template>
      <template v-slot:right>
        <van-button
          size="small"
          type="danger"
          v-if="showDelete"
          @click="$emit('delete-button-clicked')"
        >
          删除
        </van-button>
      </template>
    </post-card-header>

    <div class="body">
      <div class="content" @click="$emit('body-clicked')">{{ post.content }}</div>

      <div class="image-container">
        <van-image
          class="image"
          v-for="image in post.imageList"
          :key="image"
          :src="image"
          lazy-load
          @click="showImage(image)"
        />
      </div>

      <div class="footer">评论数量: {{ post.commentCnt }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/Post'
import moment from 'moment'
import { computed, toRefs } from 'vue'
import { showImagePreview } from 'vant'

const props = withDefaults(
  defineProps<{
    post: Post
    showUser?: boolean
    showDelete?: boolean
  }>(),
  { showUser: true, showDelete: false }
)

const { post, showUser, showDelete } = toRefs(props)

const formattedTime = computed(() => {
  return moment(post.value.time).format('MM月DD日 HH:mm')
})

const showImage = (image: string) => {
  showImagePreview({ images: [image] })
}
</script>

<style scoped lang="scss">
.post-card {
  .content {
    padding: 15px 0;
  }
  .image-container {
    // display: grid;
    // grid-template-columns: 1fr 1fr;
    // gap: 10px;
    // margin-bottom: 15px;
    .image {
      width: 100%;
    }
  }
}

.footer {
  font-size: 0.8rem;
}
</style>
