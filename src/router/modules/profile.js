/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const profileRouter = {
  path: '/profile',
  component: Layout,
  redirect: '/profile',
  name: 'profile',
  meta: {
    title: '',
    icon: 'user center',
    roles: ['admin', 'user']
  },
  children: [
    {
      path: '/profile',
      component: () => import('@/views/profile'),
      name: 'profile',
      meta: {
        title: '个人中心',
        roles: ['admin', 'user']
      }
    }
  ]
}
export default profileRouter
