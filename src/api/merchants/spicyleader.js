/**
 * Created by skz on 2017/10/12 12:10
 */

// ===================================
// =========== 麻辣教主 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================

import request from '@/common/ajax'

/**
 * 获取乐生活列表
 * @param query
 */
export function fetchSpicyLeaderList (query) {
  return request.post({
    url: '/spicyleader/list',
    reqMethod: 'operation.popularize.magazine.operate.getAllMagazine',
    params: query
  })
}

/**
 * 新增一期文章
 * @param params
 */
export function createSpicyLeader (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.saveMagazine',
    params: params
  })
}

/**
 * 编辑期数
 * @param params
 */
export function editSpicyLeader (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.updateMagazine',
    params: params
  })
}

/**
 * 发布| 下架
 * @param id      期数ID
 * @param status  状态
 */
export function publishSpicyLeader (id, status) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.updateMagazine',
    params: {id, status}
  })
}

/**
 * 删除乐生活期数记录
 * @param id      期数ID
 * @param status
 */
export function deleteSpicyLeader (id, status = -1) {
  return request.post({
    url: '/spicyleader/deleteById',
    reqMethod: 'operation.popularize.magazine.operate.deleteMagazine',
    params: {id, status}
  })
}

/**
 * 根据ID获取期数记录
 * @param id
 */
export function fetchSpicyLeaderById (id) {
  return request.post({
    url: '/spicyleader/findById',
    reqMethod: 'operation.popularize.magazine.operate.selectMagazine',
    params: {id}
  })
}

// ----------- Vote  Service -------------------
// =============================================
/**
 * 发起投票
 * @param params
 */
export function createVote (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.saveMagazineVote',
    params: params
  })
}

/**
 * 修改投票
 * @param params
 */
export function updateVote (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.saveMagazineVote',
    params: params
  })
}

/**
 * 根据投票ID 获取投票记录
 * @param vid
 */
export function fetchVoteById (vid) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.selectMagazineVote',
    params: {id: vid}
  })
}

/**
 * 根据杂志（期数）ID获取 杂记所有投票记录
 * @param magazineId
 */
export function fetchVotesByMagazineId (magazineId) {
  return request.post({
    url: '/spicyleader/vote/findByMagazineId',
    reqMethod: 'operation.popularize.magazine.operate.getMagazineVote',
    params: {magazineId: magazineId}
  })
}

/**
 * 删除投票
 * @param id
 * @param status
 */
export function deleteVote (id, status = -1) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.deleteMagazineVote',
    params: {id, status}
  })
}

/**
 * 启用|禁用投票
 * @param id
 * @param magazineId
 * @param status
 */
export function enableVote (id, magazineId, status) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.saveMagazineVote',
    params: {id, magazineId, status, voteItemList: []}
  })
}

// ----------- Vote Item Service ---------------
// =============================================

/**
 * 根据投票主题ID 获取投票项信息
 * @param voteId
 */
export function fetchVoteItemList (voteId) {
  return request.get({
    reqMethod: 'operation.popularize.magazine.operate.getAllMagazineVoteOptions',
    params: {voteId}
  })
}

/**
 * 创建投票项
 * @param params
 */
export function createVoteItem (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.saveMagazineVoteOptions',
    params: params
  })
}

/**
 * 更新投票项
 * @param params
 */
export function updateVoteItem (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.updateMagazineVoteOptions',
    params: params
  })
}

/**
 * 根据投票项ID获取投票项信息
 * @param id
 */
export function fetchVoteItemById (id) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.selectMagazineVoteOptions',
    params: {id}
  })
}

/**
 * 删除投票项
 * @param id
 */
export function deleteVoteItem (id) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.deleteMagazineVoteOptions',
    params: {id}
  })
}

