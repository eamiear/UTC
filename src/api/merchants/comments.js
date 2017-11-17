/**
 * Created by skz on 2017/10/30 9:21
 */
// ===================================
// =========== 麻辣教主 ===============
// =========== ------- ===============
// ----------- 评论管理 ---------------
// ===================================

import request from '@/common/ajax'

/**
 * 获取评论信息
 * @param query
 */
export function fetchCommentsList (query) {
  return request.post({
    url: '/comments/list',
    reqMethod: 'operation.popularize.magazine.operate.getAllMagazineComment',
    params: query
  })
}
