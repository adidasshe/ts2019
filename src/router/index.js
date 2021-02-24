import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import workbenchRouter from './modules/workbench'
import modelRouter from './modules/model'
import manageRouter from './modules/manage'
import profileRouter from './modules/profile'
import helpRouter from './modules/help'


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'home', affix: true }
      }
    ]
  },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: '个人中心', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/workbench',
    component: Layout,
    redirect: '/phase',
    name: 'workbench',
    meta: {
      // title: '仿真管理2',
      icon: 'auto'
    },
    children: [

      {
        path: '/task',
        component: () => import('@/views/workbench/task'),
        name: 'task',
        meta: { title: '仿真任务管理' },

      },
      //replay 
      {
        path: '/replay',
        component: () => import('@/views/workbench/replay'),
        name: 'replay',
        meta: {
          title: '任务回放',
        }, hidden: true
      },
      //pict
      {
        path: '/mapSelect',
        component: () => import('@/views/workbench/map-select'),
        name: 'mapSelect',
        meta: {
          title: '选取坐标',
        }, hidden: true
      },
       //realTime
       {
        path: '/realTime',
        component: () => import('@/views/workbench/realTime'),
        name: 'realTime',
        meta: {
          title: '实时回放',
        }, hidden: true
      },
      {
        path: '/result',
        component: () => import('@/views/workbench/task/result'),
        name: 'result',
        meta: {
          title: '任务结果',
        }, hidden: true
      }

    ]
  },
  // {
  //   path: '/loding',
  //   component: Layout,
  //   redirect: '/loding',
  //   children: [
  //     {
  //       path: 'loding',
  //       component: () => import('@/views/loding/index'),
  //       name: 'loding',
  //       meta: { title: '开场', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // },
  /** when your routing map is too long, you can split it into small modules **/
  // workbenchRouter,
  modelRouter,
  manageRouter,
  profileRouter,
  helpRouter,
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限',
      icon: 'lock',
      roles: ['Admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: '查看权限',
          roles: ['Admin'] // or you can only set roles in sub nav
        }
      },
      // {
      //   path: 'directive',
      //   component: () => import('@/views/permission/directive'),
      //   name: 'DirectivePermission',
      //   meta: {
      //     title: '激活权限',
      //     roles: ['Admin']
      //     // if do not set roles, means: this page does not require permission
      //   }
      // },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '设置权限',
          roles: ['superAdmin']
        }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
