/**
 * Created by skz on 2017/10/20 14:18
 */
// ===================================
// =========== 评论管理 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================

import request from '@/common/ajax'

/**
 * 获取精选评论
 * @param magazineId
 */
export function fetchCriticalComments (magazineId) {
  return request.post({
    url: '/comments/list',
    reqMethod: 'operation.popularize.magazine.operate.getMagazineChosenComment',
    params: { magazineId }
  })
}
