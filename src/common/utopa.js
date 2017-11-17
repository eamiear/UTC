/**
 * Created by skz on 2017/10/17 18:15
 * Some Service Handle Method Of Utopa
 */

import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'

export const Utopa = {
  isValidRequest (response) {
    return (response.status === 200 && response.data.code === 0)
  },
  failTips (response, defaultMsg) {
    return response.data.msg || EXCEPTION_STATUS_DESC_MAP[response.data.code] || defaultMsg
  }
}
