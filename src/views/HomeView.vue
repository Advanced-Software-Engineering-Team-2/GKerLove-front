<template>
  <div class="home">
    <van-config-provider :theme-vars="themeVars">
      <div class="user-card">
        <div class="row-1">
          <div class="avatar">
            <van-image
              :src="user.avatarUrl"
              round
              :show-loading="false"
              width="100px"
              height="100px"
            />
          </div>
          <div class="info">
            <h3 class="username">{{ user.username }}</h3>
            <div class="detail">
              <p>性别： {{ user.info.gender ? user.info.gender : '未填写' }}</p>
              <p>年龄： {{ user.info.age ? user.info.age : '未填写' }}</p>
              <p>所在城市： {{ user.info.city ? user.info.city : '未填写' }}</p>
              <p>培养单位： {{ user.info.institute ? user.info.institute : '未填写' }}</p>
            </div>
          </div>
        </div>
        <van-divider />
        <div class="row-2">
          <p>自我介绍：{{ user.info.introduction }}</p>
        </div>
        <van-divider />
        <div class="row-3">
          <span>人气： {{ user.likedBy }}</span>
          <span>喜欢： {{ user.likes }}</span>
          <div>
            <van-button
              type="primary"
              round
              size="small"
              @click="router.push('/updateInfo')"
              style="margin-right: 15px"
            >
              完善信息
            </van-button>
            <van-button color="red" round size="small" @click="handleLogoutButtonClicked">
              退出登录
            </van-button>
          </div>
        </div>
      </div>
      <van-button class="new-post-button" @click="router.push('/newPost')" icon="photo-o" />
    </van-config-provider>
  </div>
</template>

<script setup lang="ts">
import type { ConfigProviderThemeVars } from 'vant'

import router from '@/router'
import { useUserStore } from '@/stores/user'
import { showSuccess } from '@/utils/show'
import { TUICore } from '../TUIKit'
const user = useUserStore()

const themeVars: ConfigProviderThemeVars = {
  buttonIconSize: '2rem'
}

const handleLogoutButtonClicked = async () => {
  try {
    const TUIins = TUICore.instance
    await TUIins.logout()
    showSuccess('退出登录成功')
    router.push('/login')
    await user.resetToken()
  } catch (_) {
    /* empty */
  }
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

  .row-3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.new-post-button {
  display: block;
  margin: 10px auto;
  border: 0;
  background: var(--red-gradient);
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}
</style>
