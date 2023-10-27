import { createRouter, createWebHistory } from 'vue-router'

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
      component: () => import('@/layout/MainLayout.vue')
    }
  ]
})

router.beforeEach((to, _, next) => {
  document.title = to.meta.title as string
  next()
})

export default router
