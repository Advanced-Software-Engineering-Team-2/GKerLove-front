<template>
  <div class="home">
    <div class="user-card">
      <div class="row-1">
        <div class="avatar">
          <van-image :src="user.avatar" round :show-loading="false" width="100px" height="100px" />
        </div>
        <div class="info">
          <h3 class="username">{{ user.username }}</h3>
          <div class="detail">
            <p>性别： {{ user.gender ? user.gender : '未填写' }}</p>
            <p>年龄： {{ user.age ? user.age : '未填写' }}</p>
            <p>所在城市： {{ user.city }}</p>
            <p>培养单位： {{ user.institute ? user.institute : '未填写' }}</p>
          </div>
        </div>
      </div>
      <van-divider />
      <div class="row-2">
        <p>自我介绍：{{ user.introduction }}</p>
      </div>
      <van-divider />
      <div class="row-3">
        <span>人气: {{ user.likedBy }}</span>
        <span>喜欢: {{ user.likes }}</span>
        <div class="button-box">
          <van-button
            color="blue"
            round
            size="small"
            @click="router.push('/updateInfo')"
            style="margin-right: 5px"
          >
            完善信息
          </van-button>
          <van-button
            color="green"
            round
            size="small"
            @click="router.push('/newPost')"
            style="margin-right: 5px"
          >
            发布动态
          </van-button>
          <van-button color="red" round size="small" @click="handleLogoutButtonClicked">
            退出登录
          </van-button>
        </div>
      </div>
      <van-divider />
      <div class="post-card-list">
        <post-card
          class="post-card"
          v-for="post in user.posts"
          :key="post.id"
          :post="post"
          :username="user.username!"
          :avatar="user.avatar!"
          :show-delete-button="true"
          @delete-button-clicked="user.deletePost(post.id)"
        />
        <van-back-top right="10vw" bottom="10vh" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { showSuccess } from '@/utils/show'
import { TUICore } from '../TUIKit'

const user = useUserStore()

await user.fetchPosts()

const handleLogoutButtonClicked = async () => {
  try {
    const TUIins = TUICore.instance
    await TUIins.logout()
    showSuccess('退出登录成功')
    router.push('/login')
    user.$reset()
  } catch (err) {
    console.log(err)

    /* empty */
  }
}
</script>

<style scoped lang="scss">
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

.row-3 {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .button-box {
    display: flex;
    align-items: center;
  }
}

.post-card {
  margin: 10px 0;
}

// .new-post-button {
//   display: block;
//   margin: 10px auto;
//   border: 0;
//   background: var(--red-gradient);
//   width: 4rem;
//   height: 4rem;
//   border-radius: 50%;
// }
</style>
