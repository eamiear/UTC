/**
 * 路由控制、权限控制
 */
/* eslint-disable no-unused-vars*/
/* eslint-disable no-extra-boolean-cast*/
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Notification } from 'element-ui'
import { getToken, getUID } from '@/common/auth' // 验权
import { EXCEPTION_STATUS_DESC_MAP, SERVER_CRASH, NOT_LOGIN_USER } from '@/common/constants'

// permission judge
function hasPermission (roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// register global progress.
const whiteList = ['/login', '/authredirect', '/system/menuorg', '/merchant/spicyleader', '/system/menu']// 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  if (getToken() && getUID()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          if (res.code !== 0) {
            Notification({
              message: EXCEPTION_STATUS_DESC_MAP[res.code] || '获取用户信息失败',
              type: 'error'
            })
            if (res.code === SERVER_CRASH) {
              // TODO convert to 500
              // next({path: '/404'})
              store.dispatch('FedLogOut').then(() => {
                next({ path: '/login' })
              })
            }
            if (res.code === NOT_LOGIN_USER) { // 用户未登录|用户登录失效|用户在其他PC登录
              store.dispatch('FedLogOut').then(() => {
                next({ path: '/login' })
              })
            }
            // process.env.NODE_ENV === 'production' && console.log(res)
            next({path: '/login'})
          } else {
            const roles = []
            store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
              console.log('rotuer ', store.getters.addRouters)
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to }) // hack方法 确保addRoutes已完成
            })
          }
          next({ ...to })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/login' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.role)) {
          next()
        } else {
          next({path: '/401', query: { noGoBack: true }})
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
