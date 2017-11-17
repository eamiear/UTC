/**
 * Created by skz on 2017/10/19 12:28
 */
// ===================================
// =========== 用户管理 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================
import request from '@/common/ajax'
import { CLIENT_TYPES } from '@/common/constants'

/**
 * 根据用户ID获取用户信息
 * @param uid
 */
export function fetchUserInfo (uid) {
  return request.post({
    url: '/findUserInfo',
    reqMethod: 'account.userdata.getUserByUid',
    params: {uid}
  })
}

/**
 * 根据平台类型获取用户列表
 * @param query
 */
export function fetchUserList (query = {}) {
  return request.post({
    reqMethod: 'account.userdata.getUserList',
    params: query
  })
}

/**
 * 创建用户/平台注册
 * @param params
 */
export function createUser (params) {
  !params.sysId && (params.sysId = CLIENT_TYPES.OPERATION_PLATFORM)
  return request.post({
    reqMethod: 'account.reg.doReg',
    params: params
  })
}

/**
 * 启用用户账号
 * @param uid
 */
export function enableUser (uid) {
  return request.post({
    reqMethod: 'account.user.service.unDisableUser',
    params: {uid}
  })
}

/**
 * 禁用用户账号
 * @param uid
 */
export function disableUser (uid) {
  return request.post({
    reqMethod: 'account.user.service.disableUser',
    params: {uid}
  })
}

