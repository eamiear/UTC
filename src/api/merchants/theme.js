/**
 * Created by skz on 2017/10/16 10:49
 */

// ===================================
// =========== 主题管理 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================

import request from '@/common/ajax'

export function fetchThemeList (query) {
  return request.post({
    url: '/theme/fetch',
    reqMethod: 'operation.popularize.magazine.operate.getAllTag',
    params: query
  })
}

export function createThemeItem (params) {
  return request.post({
    url: '/theme/create',
    reqMethod: 'operation.popularize.magazine.operate.saveMagazineTag',
    params: params
  })
}

export function updateThemeItem (params) {
  return request.post({
    url: '/theme/update',
    reqMethod: 'operation.popularize.magazine.operate.updateMagazineTag',
    params: params
  })
}

export function deleteThemeItem (id) {
  return request.post({
    url: '/theme/delete',
    reqMethod: 'operation.popularize.magazine.operate.deleteMagazineTag',
    params: {id}
  })
}

export function fetchThemeItemById (id) {
  return request.post({
    url: '/theme/select',
    reqMethod: 'operation.popularize.magazine.operate.selectTag',
    params: {id}
  })
}

export function searchThemeByName (name) {
  return request.post({
    url: '/theme/select',
    reqMethod: 'operation.popularize.magazine.operate.getMagazineTag',
    params: {name}
  })
}

export function searchThemeById (id) {
  return request.post({
    url: '/theme/select',
    reqMethod: 'operation.popularize.magazine.operate.getMagazineTag',
    params: {id}
  })
}
