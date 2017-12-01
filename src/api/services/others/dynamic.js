/**
 * Created by skz on 2017/11/30 14:56
 */
import request from '@/common/ajax'

export function fetchCodeList () {
  return request.post({
    url: '/others/dynamic/code'
  })
}

export function fetchServiceParamList (code) {
  return request.post({
    url: '/others/dynamic/findServiceParamsByCode',
    params: {code}
  })
}

export function fetchSystemParamsList () {
  return request.post({
    url: '/others/dynamic/findSystemParams'
  })
}

export function fetchOperatorsList (paramType) {
  return request.post({
    url: '/others/dynamic/findOperatorsByParamType',
    params: {paramType}
  })
}

export function fetchActionTypeList () {
  return request.post({
    url: '/others/dynamic/findActionTypeList'
  })
}
