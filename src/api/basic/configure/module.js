/**
 * Created by skz on 2017/11/8 11:51
 */

import request from '@/common/ajax'

/**
 */
export function fetchConfigureList (query) {
  return request.post({
    url: '/configure/list',
    params: query
  })
}

export function fetchProductList () {
  return request.post({
    url: '/configure/product/list'
  })
}

export function fetchPageList () {
  return request.post({
    url: '/configure/page/list'
  })
}

export function batchRemove (param) {
  return request.post({
    url: '/configure/batchRemove',
    params: param
  })
}
