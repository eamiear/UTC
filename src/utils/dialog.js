/**
 * Created by skz on 2017/10/16 20:47
 */
import { Message } from 'element-ui'

export function success (msg = '') {
  Message({
    type: 'success',
    message: msg
  })
}

export function error (msg = '') {
  Message({
    type: 'error',
    message: msg
  })
}

export function warn (msg = '') {
  Message({
    type: 'warning',
    message: msg
  })
}

export function info (msg = '') {
  Message({
    type: 'info',
    message: msg
  })
}

