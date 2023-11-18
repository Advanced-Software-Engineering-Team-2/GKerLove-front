<template>
  <div class="post-card-header">
    <div class="left">
      <slot name="left">
        <div class="avatar">
          <van-image :src="props.avatar" round :show-loading="false" width="3rem" height="3rem" />
        </div>
        <div>
          <div class="username">{{ props.username }}</div>
          <div class="time">{{ formattedTime }}</div>
        </div>
      </slot>
    </div>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import moment from 'moment'

const props = defineProps<{
  username: string
  avatar: string
  time: string
}>()

const formattedTime = computed(() => {
  return moment(props.time).format('MM月DD日 HH:mm')
})
</script>

<style scoped lang="scss">
.post-card-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;

  .left {
    display: flex;
    justify-content: left;
    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 6px;
    }
  }

  .right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
