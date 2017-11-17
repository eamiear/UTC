/**
 * Created by skz on 2017/10/911:09
 */

// ===================================
// =========== 基础平台 ===============
// =========== ------- ===============
// ----------- 区域代码 ---------------
// ===================================

import request from '@/common/ajax'

/**
 * 获取区域代码
 * @param query
 */
export function fetchAreaCodeList (query) {
  return request.get({
    url: '/basicplatform/areacode2',
    params: query
  })
}

/**
 * TODO 查询区域代码
 * @param query
 */
export function searchAreaCodeList (query) {
  return request.get({
    url: '/',
    method: 'get',
    params: query
  })
}

/**
 * TODO 新增区域代码项
 * @param params
 */
export function createAreaCodeItem (params) {
  return request.post({
    url: '/basicplatform/areacode2',
    method: 'post',
    params: params || {}
  })
}

/**
 * TODO 编辑区域代码项
 * @param params
 */
export function editAreaCodeItem (params) {
  return request.post({
    url: '/basicplatform/areacode2',
    params: params
  })
}

/**
 * TODO 删除区域代码项
 * @param id
 */
export function deleteAreaCodeItem (id) {
  return request.post({
    url: '/basicplatform/areacode2',
    params: {id: id}
  })
}
