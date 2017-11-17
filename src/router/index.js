import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Layout from '@/views/layout/Layout'

/**
 * vue-router: params of vue-router
 * path: path of the route
 * name: name of the router
 * redirect : if `redirect:noredirect` will no redirect in the levelbar
 * meta : { role: ['admin'] }  will control the page role
 * icon : the icon show in the sidebar using font-awesome
 * image: the image show in the sidebar using a picture for the icon, image has higher priority than icon
 * isShow : if `isShow:false` will not show in the sidebar
 * labels: [{classes: 'bg-red', text: '5'}] will show on the right side of the sidebar
 * isSingle : `isSingle:true` means the item has not submenu
 **/
export const constantRouterMap = [
  { path: '/login', component: require('@/views/login/index'), isShow: 0 },
  { path: '/404', component: require('@/views/errorPage/404'), isShow: 0 },
  { path: '/401', component: require('@/views/errorPage/401'), isShow: 0 },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    isShow: 0,
    children: [{ path: 'dashboard', component: require('@/views/dashboard/index') }]
  },
  {path: '', name: '组件列表', isHeader: true},
  {
    path: '/component/table',
    component: Layout,
    isShow: 1,
    icon: 'table',
    name: '表格',
    redirect: 'u-table',
    children: [
      { name: 'u-table', path: 'u-table', icon: 'circle-o', isShow: 1, component: require('@/views/components/table/u-table') },
      { name: 'table-tree', path: 'table-tree', icon: 'circle-o', isShow: 1, component: require('@/views/components/table/table-tree') }
    ]
  },
  {
    path: '/component/box',
    component: Layout,
    isShow: 1,
    icon: 'circle-o',
    name: '盒子',
    redirect: 'u-table',
    children: [
      { name: 'box', path: 'u-box', icon: 'circle-o', isShow: 1, component: require('@/views/components/box/uBox') },
      { name: 'info-box', path: 'u-info-box', icon: 'circle-o', isShow: 1, component: require('@/views/components/box/uInfoBox') },
      { name: 'small-box', path: 'u-small-box', icon: 'circle-o', isShow: 1, component: require('@/views/components/box/uSmallBox') }
    ]
  },
  {path: '', name: '模板列表', isHeader: true},
  {
    path: '/template/form',
    component: Layout,
    isShow: 1,
    icon: 'form',
    name: '表单',
    redirect: 'base',
    children: [
      { name: '基础表单', path: 'base', icon: 'circle-o', isShow: 1, component: require('@/views/template/form/base') }
    ]
  },
  {path: '', name: '业务操作', isHeader: true},
  {
    path: '/service/table',
    component: Layout,
    isShow: 1,
    icon: 'table',
    name: '表格',
    redirect: 'base',
    children: [
      { name: '基础表格', path: 'base', icon: 'circle-o', isShow: 1, component: require('@/views/service/table/base') },
      { name: '通用表格', path: 'universal', icon: 'circle-o', isShow: 1, component: require('@/views/service/table/universal') },
      { name: '加强版', path: 'enhance', icon: 'circle-o', isShow: 1, component: require('@/views/service/table/enhance') },
      { name: '新增记录', path: 'addRecord', icon: 'circle-o', isShow: 1, component: require('@/views/service/table/addRecord') }
    ]
  }
]

export const asyncRouterMap = [
  { path: '*', redirect: '/404', isHidden: true }
]

export default new VueRouter({
  // mode: 'hash|history|abstract',
  // base: '/',
  // linkActiveClass: 'router-link-active',
  // scrollBehavior: fn
  // base: '/omp',
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

