import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/audit',
    component: Layout,
    redirect: '/audit/crime',
    name: 'Audit',
    meta: { title: 'Audit', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'crime',
        name: 'Crime',
        component: () => import('@/views/auditManage/crime/index'),
        meta: { title: 'Crime', icon: 'table' }
      },
      {
        path: 'blood',
        name: 'Blood',
        component: () => import('@/views/auditManage/blood/index'),
        meta: { title: 'Blood', icon: 'tree' }
      },
      {
        path: 'phoneCost',
        name: 'PhoneCost',
        component: () => import('@/views/auditManage/phoneCost/index'),
        meta: { title: 'PhoneCost', icon: 'tree' }
      },
      {
        path: 'donation',
        name: 'Donation',
        component: () => import('@/views/auditManage/donation/index'),
        meta: { title: 'Donation', icon: 'tree' }
      },
      {
        path: 'volunteer',
        name: 'Volunteer',
        component: () => import('@/views/auditManage/volunteer/index'),
        meta: { title: 'Volunteer', icon: 'tree' }
      }
    ]
  },
  {
    path: '/manage',
    component: Layout,
    children: [
      {
        path: 'accounts',
        name: 'Accounts',
        component: () => import('@/views/accountManage/index'),
        meta: { title: 'Accounts', icon: 'form' }
      }
    ]
  },
  {
    path: '/videos',
    component: Layout,
    redirect: '/videos/fundamental',
    name: 'Videos',
    meta: {
      title: 'Videos',
      icon: 'nested'
    },
    children: [
      {
        path: 'fundamental',
        component: () => import('@/views/videoManage/fundamental/index'), // Parent router-view
        name: 'Fundamental',
        meta: { title: 'fundamental' }
      },
      {
        path: 'financial',
        component: () => import('@/views/videoManage/financial/index'),
        name: 'Financial',
        meta: { title: 'financial' }
      },
      {
        path: 'honesty',
        component: () => import('@/views/videoManage/honesty/index'),
        name: 'Honesty',
        meta: { title: 'honesty' }
      }
    ]
  },
  {
    path: '/videos',
    component: Layout,
    children: [
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/views/upload/index'),
        meta: { title: 'Upload', icon: 'form' }
      }
    ]
  },

  {
    path: '/message',
    component: Layout,
    children: [
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/message/message'),
        meta: { title: 'System Message', icon: 'table' }
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

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
