/**
 * Created by skz on 2017/10/30 14:45
 */
// ===================================
// =========== 商场 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================

import request from '@/common/ajax'

export function fetchMallsList () {
  return request.post({
    url: '/malls/list'
  })
}
export function createMall () {
  return request.post({
    url: '/malls/create'
  })
}

