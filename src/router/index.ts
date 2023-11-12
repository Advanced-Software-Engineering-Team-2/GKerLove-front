import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

import { useUser } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/MainLayout.vue'),
      redirect: '/meet',
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
        title: '完善详细信息'
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

router.beforeEach(async (to, _, next) => {
  document.title = to.meta.title as string
  const hasToken = getToken()

  const indexuser = useUser()
  await indexuser.getUser()
  if (!hasToken) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
  next()
})

export default router
