<template>
  <div class="user-card" >
    <div class="row-1">
      <div class="avatar" v-show="meet.list.length>0">
        <van-image :src="meet.curavatar" round :show-loading="false" width="100px" height="100px" />
      </div>
      <div class="info">
        <h3 class="username">{{ meet.list.length>0 ? meet.list[index].username : '' }}</h3>
        <div class="detail">
          <p>性别： {{ meet.list.length>0 ? meet.list[index].info.gender : '' }}</p>
          <p>年龄： {{ meet.list.length>0 ? meet.list[index].info.age : '' }}</p>
          <p>所在城市： {{ meet.list.length>0 ? meet.list[index].info.city : '' }}</p>
          <p>培养单位： {{ meet.list.length>0 ? meet.list[index].info.institute : '' }}</p>
        </div>
      </div>
    </div>
    <van-divider />
    <div class="row-2">
      <p>自我介绍：{{ meet.list.length>0 ? meet.list[index].info.introduction : ''}}</p>
    </div>
    <van-divider />
  </div>
  <div style="margin: 16px; display: flex; justify-content: space-between">
    <van-button round block type="primary" @click="handlePreClicked"> 上一位 </van-button>
    <van-button round block type="primary" @click="handleNextClicked" style="margin-left: 2rem"> 下一位 </van-button>
  </div>
  <div style="margin: 16px; display: flex; justify-content: space-between">
    <van-button color="green" round block type="primary" @click="handleLikeClicked"> 喜欢 </van-button>
    <van-button color="red" round block type="primary" @click="handleHateClicked" style="margin-left: 2rem"> 不喜欢 </van-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/stores/user'
import { useMeet } from '@/stores/meet'
const user = useUser()
user.getUser()
const meet = useMeet()
meet.getList(user.username)
const index = ref(0)
const handlePreClicked = async () => {
  if (index.value > 0) {
    index.value--;
    meet.getavatar(index.value)
  } else {
    alert('已经是第一位了');
  }
}

const handleNextClicked =  () => {
  if (index.value < meet.list.length - 1) {
    index.value++;
    meet.getavatar(index.value)
  } else {
    alert('已经是最后一位了');
  }
}

const handleLikeClicked =  () => {
  meet.addLove(user.username, meet.list[index.value].username)
}

const handleHateClicked = async () => {
}
</script>

<style scoped lang="scss">
.user-card {
  .row-1 {
    display: flex;
    .avatar {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
    }
    .info {
      flex: 3;
      margin-left: 5px;
      .username {
        font-size: 1.5rem;
      }
    }
  }
}
</style>
