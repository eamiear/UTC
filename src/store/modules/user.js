import { loginByUsername, logout, getUserInfo } from '@/api/common/login'
import { getToken, setToken, removeToken, getUID, setUID, removeUID } from '@/common/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    uid: getUID(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const result = response.data
          const serviceData = result.data
          if (response.status === 200 && result.code === 0) {
            const accessToken = serviceData.accessToken
            const uid = serviceData.uid
            setToken(accessToken)
            setUID(uid)
            commit('SET_TOKEN', accessToken)
            commit('SET_UID', uid)
          }
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.uid, state.token).then(response => {
          // TODO
          const result = response.data
          const serviceData = result.data
          if (response.status === 200 && result.code === 0) {
            commit('SET_ROLES', [serviceData])
            commit('SET_NAME', serviceData.name)
            commit('SET_AVATAR', serviceData.portrait)
            commit('SET_INTRODUCTION', serviceData.introduction)
          } else {
            console.log(result)
          }
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_UID', '')
          commit('SET_ROLES', [])
          removeToken()
          removeUID()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_UID', '')
        removeToken()
        removeUID()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRole ({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
