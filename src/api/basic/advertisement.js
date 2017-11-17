/**
 * Created by yym on 2017/10/25 14:47
 */

// ===================================
// =========== 广告 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================

import request from '@/common/ajax'

/**
 * 获取广告列表
 * @param query
 */
export function getAdvertisementList (pageSize, pageNo) {
  return request.post({
    reqMethod: 'operation.base.advertisement.getAdvertisementList',
    params: {pageSize, pageNo}
  })
}

/**
 * 保存广告
 * @param params
 * @returns {*|AxiosPromise}
 */
export function saveAdvertisement (params) {
  return request.post({
    reqMethod: 'operation.base.advertisement.saveAdvertisement',
    params: params
  })
}

/**
 * 更新广告
 * @param params
 * @returns {*|AxiosPromise}
 */
export function updateAdvertisement (params) {
  return request.post({
    reqMethod: 'operation.base.advertisement.updateAdvertisement',
    params: params
  })
}

/**
 * 获取广告位列表
 * @param params
 * @returns {*|AxiosPromise}
 */
export function getAdvertisementSpaceList (pageSize, pageNo) {
  return request.post({
    reqMethod: 'operation.base.advertisement.getAdvertisementSpaceList',
    params: {pageSize, pageNo}
  })
}

/**
 * 保存广告位
 * @param params
 * @returns {*|AxiosPromise}
 */
export function saveAdvertisementSpace (params) {
  return request.post({
    reqMethod: 'operation.base.advertisement.saveAdvertisementSpace',
    params: params
  })
}

/**
 * 更新广告位
 * @param params
 * @returns {*|AxiosPromise}
 */
export function updateAdvertisementSpace (params) {
  return request.post({
    reqMethod: 'operation.base.advertisement.updateAdvertisementSpace',
    params: params
  })
}

/**
 * 删除广告位
 * @param params
 * @returns {*|AxiosPromise}
 */
export function deleteAdvertisementSpace (id) {
  return request.post({
    reqMethod: 'operation.base.advertisement.deleteAdvertisementSpace',
    params: {id}
  })
}

