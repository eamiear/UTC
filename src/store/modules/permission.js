import { asyncRouterMap, constantRouterMap } from '@/router'
// import { constantRouterMap } from '@/router'
// import { getUID } from '@/common/auth'
// import { fetchMenuList } from '@/api/system/menu'
// const _import = require('@/router/_import_production')
/* eslint-disable no-unused-vars*/
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter (asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    // if (hasPermission(roles, route)) {
    //   if (route.children && route.children.length) {
    //     route.children = filterAsyncRouter(route.children, roles)
    //   }
    //   return true
    // }
    // return false
    return true
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    asyncRouterMap: [],
    addRouters: [],
    authorityInfo: null
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_ASYNC_ROUTER_MAP: (state, asyncRouterMap) => {
      state.asyncRouterMap = asyncRouterMap
    },
    SET_AUTHORITY_INFO: (state, authorityInfo) => {
      state.authorityInfo = authorityInfo
    },
    DEL_AUTHORITY_INFO: (state) => {
      state.authorityInfo = null
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        // if (roles.indexOf('admin') >= 0) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // }

        accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
        // const handleRouters = (routers) => {
        //   Array.from(routers).forEach(function (router) {
        //     router.component = _import(router.component.slice(router.component.indexOf('views') + 6))
        //     if (router.children && router.children.length > 0) {
        //       handleRouters(router.children)
        //     }
        //     return false
        //   })
        //   return routers
        // }
        // fetchMenuList(getUID()).then(response => {
        //   const result = response.data
        //   const routerMap = handleRouters(result.data.menus)
        //   accessedRouters = filterAsyncRouter(routerMap, roles)
        //   commit('SET_ASYNC_ROUTER_MAP', routerMap)
        //   commit('SET_ROUTERS', accessedRouters)
        //   resolve()
        // })
      })
    }
  }
}

export default permission
