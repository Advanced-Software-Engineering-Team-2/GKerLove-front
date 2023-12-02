<template>
  <div
    class="user-card"
    :style="{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)), url(${user.avatar})`,
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <div class="user-info">
      <h1 class="username">
        <van-space>
          <span>{{ user.username }}</span>
          <van-tag v-if="user.online" type="success" size="large">在线</van-tag>
          <van-tag v-else-if="user.lastOnline" type="warning" size="large">
            {{ '上次在线: ' + getLastOnlineInfo(user.lastOnline) }}
          </van-tag>
        </van-space>
      </h1>
      <p>性别： {{ user.gender ? user.gender : '未填写' }}</p>
      <p>年龄： {{ user.age ? user.age : '未填写' }}</p>
      <p>所在城市： {{ user.city ? user.city : '未填写' }}</p>
      <p>培养单位： {{ user.institute ? user.institute : '未填写' }}</p>
      <p>自我介绍：{{ user.introduction ? user.introduction : '未填写' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@/types/User'
import { toRefs } from '@vueuse/core'
import moment from 'moment'

const props = defineProps<{
  user: User
}>()

const { user } = toRefs(props)

const getLastOnlineInfo = (lastOnline: string) => {
  const days = Math.floor(moment.duration(moment().diff(moment(lastOnline))).asDays())
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days === 2) {
    return '前天'
  } else {
    return `${days}天前`
  }
}
</script>

<style scoped lang="scss">
.user-card {
  border-radius: 20px;
  position: relative;

  .user-info {
    padding: 10px;
    position: absolute;
    bottom: 0;
  }
}
</style>
