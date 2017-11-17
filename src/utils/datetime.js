/**
 * Created by skz on 2017/10/16 15:38
 */
import Moment from 'moment'
export const DateUtil = {
  fmt: 'YYYY-MM-DD HH:mm:ss',
  format: function (time, fmt) {
    return Moment(time).format(fmt || this.fmt)
  },
  getToday: function (fmt) {
    return Moment().format(fmt || this.fmt)
  },
  getYesterday: function (fmt) {
    return Moment().subtract(1, 'days').format(fmt || this.fmt)
  },
  getTomorrow: function (fmt) {
    return Moment().add(1, 'days').format(fmt || this.fmt)
  },
  getLastThirdDay: function (fmt) {
    return Moment().subtract(3, 'days').format(fmt || this.fmt)
  },
  getLastWeek: function (fmt) {
    return Moment().subtract(1, 'week').format(fmt || this.fmt)
  },
  getLastMonth: function (fmt) {
    return Moment().subtract(1, 'month').format(fmt || this.fmt)
  }
}
