import Cookies from 'js-cookie'
import { getOperatePath, setOperatePath } from '@/common/storage'

const app = {
  state: {
    sidebar: {
      opened: !+(Cookies.get('sidebarStatus') || 0)
    },
    lang: '',
    operatePath: getOperatePath() || '',
    visitedViews: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (!state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (view.conf.imt) {
        view.path = view.path.slice(0, view.path.lastIndexOf('/') + 1) + view.conf.id
      }
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({ name: view.name, path: view.path, conf: view.conf })
    },
    DEL_VISITED_VIEWS: (state, view) => {
      let index
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i
          break
        }
      }
      state.visitedViews.splice(index, 1)
    },
    SWITCH_LANG (state, lang) {
      state.lang = lang
      // Vue.config.lang = lang
    },
    MODIFY_OPERATION_PATH (state, path) {
      setOperatePath(path)
      state.operatePath = path
    }
  },
  actions: {
    ToggleSideBar ({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    addVisitedViews ({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews ({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    switchLang ({ commit }, lang) {
      commit('SWITCH_LANG', lang)
    },
    updateOperatePath ({ commit }, path) {
      commit('MODIFY_OPERATION_PATH', path)
    }
  }
}

export default app
