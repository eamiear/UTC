import request from '@/common/ajax'

export function getQiNiuToken () {
  return request.post({
    url: '/qiniu/token',
    reqMethod: 'common.upload.getUpToken',
    params: {}
  })
}
