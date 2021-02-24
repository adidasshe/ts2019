/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const manageRouter = {
  path: '/manage',
  component: Layout,
  redirect: '/user',
  name: 'manage',
  meta: {
    // title: '用户管理',
    icon: 'Customer management-fill',
    roles: ['admin']
  },
  children: [
    {
      path: '/user',
      component: () => import('@/views//manage/user'),
      name: 'user',
      meta: {
        title: '用户管理',
        roles: ['admin']
      }
    }
  ]
}
export default manageRouter
