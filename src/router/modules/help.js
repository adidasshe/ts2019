/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const helpRouter = {
  path: '/help',
  component: Layout,
  redirect: '/help',
  name: 'help',
  meta: {
    // title: '帮助中心',
    icon: 'help',
    roles: ['admin', 'user']
  },
  children: [
    {
      path: '/help',
      component: () => import('@/views/help'),
      name: 'help',
      meta: {
        title: '帮助',
        roles: ['admin', 'user']
      }
    }
  ]
}
export default helpRouter
