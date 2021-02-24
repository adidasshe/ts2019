/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/model',
  component: Layout,
  redirect: '/model',
  name: 'model',
  meta: {
    // title: '模型管理',
    icon: 'product'
  },
  children: [
    {
      path: '/model',
      component: () => import('@/views/model'),
      name: 'model',
      meta: { title: '模型管理' }
    }
  ]
}

export default chartsRouter
