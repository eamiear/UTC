/**
 * Created by skz on 2017/10/19 22:47
 */

// =======================================
// =========== 平台通用请求 ===============
// =========== ------- ===================
// -----------  --------------------------
// =======================================

import request from '@/common/ajax'

// 获取平台类型
export function fetchClientTypes () {
  return request.post({
    url: '/findSystemTypes',
    reqMethod: 'account.system.getSystems'
  })
}
