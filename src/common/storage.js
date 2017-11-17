/**
 * Created by skz on 2017/11/13 11:35
 */
import { LOCALES_LANG_KEY, OPERATE_PATH_KEY } from '@/common/constants'

export const setStore = (key, value) => {
  if (!key) return
  if (typeof value !== 'string') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

export const getStore = key => {
  if (!key) return
  return window.localStorage.getItem(key)
}

export const removeStore = key => {
  if (!key) return
  window.localStorage.removeItem(key)
}

export const getLocalesLang = () => {
  return getStore(LOCALES_LANG_KEY)
}

export const setLocalesLang = (locale) => {
  setStore(LOCALES_LANG_KEY, locale)
}

export const removeLocalesLang = () => {
  removeStore(LOCALES_LANG_KEY)
}

export const getOperatePath = () => {
  return getStore(OPERATE_PATH_KEY)
}

export const setOperatePath = (operatePath) => {
  setStore(OPERATE_PATH_KEY, operatePath)
}

export const removeOperatePath = () => {
  removeStore(OPERATE_PATH_KEY)
}
