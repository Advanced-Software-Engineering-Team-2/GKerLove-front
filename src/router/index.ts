import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // scrollBehavior(_to, _from, savedPosition) {
  //   console.log(savedPosition)

  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { top: 0 }
  //   }
  // },
  routes: [
    {
      path: '/',
      component: () => import('@/layout/MainLayout.vue'),
      redirect: '/home',
      children: [
        {
          path: 'meet',
          name: 'meet',
          component: () => import('@/views/MeetView.vue'),
          meta: {
            title: '遇见'
          }
        },
        {
          path: 'message',
          name: 'message',
          component: () => import('@/views/MessageView.vue'),
          meta: {
            title: '消息'
          }
        },
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: {
            title: '我的'
          }
        },
        {
          path: 'post',
          name: 'post',
          component: () => import('@/views/PostView.vue'),
          meta: {
            title: '动态'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/updateInfo',
      name: 'updateInfo',
      component: () => import('@/views/UpdateInfoView.vue'),
      meta: {
        title: '完善信息'
      }
    },
    {
      path: '/newPost',
      name: 'newPost',
      component: () => import('@/views/NewPostView.vue'),
      meta: {
        title: '发布动态'
      }
    },
    {
      path: '/post/:id',
      name: 'postDetail',
      component: () => import('@/views/PostDetailView.vue'),
      meta: {
        title: '动态详情'
      }
    },
    {
      path: '/user/:id',
      name: 'userDetail',
      component: () => import('@/views/UserDetailView.vue'),
      meta: {
        title: '用户详情'
      }
    },
    {
      path: '/likes',
      name: 'Likes',
      component: () => import('@/views/LikesView.vue'),
      meta: {
        title: '我喜欢的人'
      }
    },
    {
      path: '/selectMeet',
      name: 'selectMeet',
      component: () => import('@/views/SelectMeetView.vue'),
      meta: {
        title: '对系统推荐的用户进行筛选'
      }
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404.vue'),
      meta: {
        title: '页面不存在'
      }
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
})

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  to.meta.from = from // 记录路由来源
  document.title = to.meta.title as string
  const hasToken = getToken()
  if (!hasToken) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
  const user = useUserStore()
  if (!user.username) {
    if (whiteList.indexOf(to.path) === -1) {
      await user.initUser()
    }
  }
  next()
})

export default router
