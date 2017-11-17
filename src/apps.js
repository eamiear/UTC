// entry
import 'babel-polyfill'
import '@/utils/css'
import '@/utils/scripts'
import '@/common/permission' // 权限
// import * as storage from '@/common/storage'

import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import App from './App'

import EventBus from '@/common/bus'

import * as filters from './filters' // 全局filter
import '@/components/Icon' // icon
// import '@/mock'
import VueI18n from 'vue-i18n'
// import { zh_CN, en_US } from '@/locales'

// lib
import ElementUI from 'element-ui'
// import enLocale from 'element-ui/lib/locale/lang/en'
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// import locale from 'element-ui/lib/locale'
import messages from '@/locales'
import 'element-ui/lib/theme-default/index.css'
import '@/assets/styles/index.scss'

Vue.use(VueI18n)
Vue.use(ElementUI)

Vue.prototype.$bus = EventBus

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// setting language
// const navLang = navigator.language
// const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
// const lang = storage.getLocalesLang() || localLang || 'zh-CN'
// console.log(lang)

console.log('messages: -> ', messages)
// Create VueI18n instance with options
// const i18n = new VueI18n({
//   locale: 'en', // set locale
//   messages
// })
const i18n = new VueI18n({
  locale: 'en'
})

// Vue.use(ElementUI, {
//   i18n: function (key, value) {
//     console.log('key -> ', key)
//     console.log('value -> ', value)
//     i18n.t(key, value)
//   }
// })
// locale.use('en')
// locale.i18n((key, value) => {
//   console.log('key -> ', key)
//   console.log('value -> ', value)
//   i18n.t(key, value)
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App)
})

if (process.env.NODE_ENV === 'development') {
  console.info('[当前环境] 开发环境')
  Vue.config.devtools = false
  Vue.config.productionTip = false
}

if (process.env.NODE_ENV === 'production') {
  console.info('[当前环境] 生产环境')
  Vue.config.devtools = false
}
