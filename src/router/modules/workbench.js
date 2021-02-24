/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const workbenchRouter = {
  path: '/workbench',
  component: Layout,
  redirect: 'workbench/phase',
  name: 'workbench',
  meta: {
    title: '工作平台',
    icon: 'component'
  },
  children: [
    {
      path: 'workbench/phase',
      component: () => import('@/views/workbench/phase'),
      name: 'phase',
      meta: { title: '三相信息' }
    },
    {
      path: 'workbench/roads',
      component: () => import('@/views/workbench/roads'),
      name: 'roads',
      meta: { title: '三路信息' }
    },
    {
      path: 'workbench/control',
      component: () => import('@/views/workbench/control'),
      name: 'control',
      meta: { title: '设备操作' }
    }
  ]
}

export default workbenchRouter
