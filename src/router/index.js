// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '',
    redirect: '/beranda'
  },
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: 'beranda',
        name: 'Beranda',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'work-queue',
        name: 'Work Queue',
        component: () => import('@/views/WorkQueue.vue'),
      },
      {
        path: 'publish-subscribe',
        name: 'Publish/Subscribe',
        component: () => import('@/views/PublishSubscribe.vue'),
      },
      {
        path: 'routing',
        name: 'Routing',
        component: () => import('@/views/Routing.vue'),
      },
      {
        path: 'tasker',
        name: 'Tasker',
        component: () => import('@/views/Tasker.vue'),
      },
      {
        path: 'worker',
        name: 'Worker',
        component: () => import('@/views/Worker.vue'),
      },
      {
        path: 'broadcaster',
        name: 'Broadcaster',
        component: () => import('@/views/Broadcaster.vue'),
      },
      {
        path: 'receiver',
        name: 'Receiver',
        component: () => import('@/views/Receiver.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
