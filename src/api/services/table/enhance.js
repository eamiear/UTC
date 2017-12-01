/**
 * Created by skz on 2017/11/30 17:15
 */

import request from '@/common/ajax'

export function fetchModuleNames () {
  return request.post({
    url: '/services/table/enhance/fetchModuleNames'
  })
}

export function fetchDetail (code) {
  return request.post({
    url: '/services/table/enhance/fetchDetailById',
    params: {code}
  })
}

