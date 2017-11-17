/*

/!**
 * Created by skz on 2017/10/24 11:51
 *!/
import _ from 'lodash'
import echarts from 'echarts'
import { Helper } from '@/common/helper'

Gsui.chart = {
  /!**
   * @name Bar
   * @method
   * @memberof chart
   * @description BarChart条形图
   * @param {string} target   echart容器ID
   * @param {object} options  echart配置项
   * @example <caption>Usage of Bar</caption>
   *  var bar = Gsui.chart.Bar('bar');
   *  bar.initial(bar.getOptions());
   *
   * @returns {BarChart}
   *!/
  Bar: function (target, options) {
    return new BarChart(target, options)
  },
  /!**
   * @name Line
   * @method
   * @memberof chart
   * @description LineChart折线图
   * @param {string} target   echart容器ID
   * @param {object} options  echart配置项
   * @example <caption>Usage of Line</caption>
   *  var line = Gsui.chart.Line('line');
   *  line.initial(line.getOptions());
   *
   * @returns {LineChart}
   *!/
  Line: function (target, options) {
    return new LineChart(target, options)
  },
  /!**
   * @name Pie
   * @method
   * @memberof chart
   * @description PieChart饼图
   * @param {string} target   echart容器ID
   * @param {object} options  echart配置项
   * @example <caption>Usage of Pie</caption>
   *  var pie = Gsui.chart.Pie('pie');
   *  pie.initial(pie.getOptions());
   *
   * @returns {PieChart}
   *!/
  Pie: function (target, options) {
    return new PieChart(target, options)
  }
}

class Charts {
  init (target, options) {
    this.target = target
    this.options = _.assign({}, this.getSettings(), options)
  }
  /!**
   * @name initial
   * @method
   * @memberof Charts
   * @description 初始化
   * @param {object} options  配置项
   *
   * @example <caption>Usage of initial</caption>
   *  var line = Gsui.chart.Line('line');
   *  line.initial(line.getOptions());
   *!/
  initial (options) {
    const chart = echarts.init(document.querySelector(this.target))
    chart.setOption(options || this.options)
  }
  /!**
   * @name getSettings
   * @method
   * @memberof Charts
   * @description 获取默认配置项
   * @returns {{title: {text: string, subtext: string}, tooltip: {trigger: string}, legend: {x: string, y: string, left: number, itemWidth: number, itemHeight: number, data: Array}, calculable: boolean, grid: {left: string, right: string, bottom: string, containLabel: boolean}, xAxis: {type: string, data: Array}, yAxis: {type: string}, series: Array}}
   *!/
  getSettings () {
    return {
      title: {
        text: '',
        subtext: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        x: 'left',
        y: 'bottom',
        left: 10,
        itemWidth: 16,
        itemHeight: 16,
        data: []
      },
      calculable: true,
      /!* toolbox: {
       show: true,
       feature: {
       magicType: {type: ['line', 'bar']},
       restore: {}
       }
       },*!/
      grid: {
        left: '3%',
        right: '4%',
        bottom: '9%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: []
    }
  }
  /!**
   * @name getSeriesObj
   * @method
   * @memberof Charts
   * @description 获取 Series 对象
   * @param {string} seriesName
   * @param {array} seriesData
   * @param {object} seriesObject
   * @example <caption>Usage of Bar</caption>
   *  var bar = Gsui.chart.Bar('bar');
   *  var series = bar.getSeriesObj('最高气温',[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],{color: ['#F46C68']});
   *  bar.setSeries([series]);
   *  bar.initial(bar.getOptions());
   *
   * @returns {{name: string, type: string, data: Array}}
   *!/
  getSeriesObj (seriesName, seriesData, seriesObject) {
    var args = Array.prototype.slice.call(arguments)
    var argumentSize = args.length
    var Obj = {
      name: '',
      type: 'line',
      data: []
    }

    if (argumentSize === 1 && Helper.isObject(args[0])) {
      Obj = _.assign({}, Obj, args[0])
    } else if (argumentSize === 2 && Helper.isString(args[0]) && Helper.isArray(args[1])) {
      Obj.name = args[0]
      Obj.data = args[1]
    } else if (argumentSize === 3) {
      Obj.name = args[0]
      Obj.data = args[1]
      Obj = _.assign({}, Obj, args[2])
    } else {
      console.log('getSeriesObject fail: ', 'arguments error')
    }
    return Obj
  }
  /!**
   * @name setSeries
   * @method
   * @memberof Charts
   * @description 设置Series
   * @param {object} seriesObject
   *
   * @example <caption>Usage of Bar</caption>
   *  var bar = Gsui.chart.Bar('bar');
   *  var series = bar.getSeriesObj('最高气温',[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],{color: ['#F46C68']});
   *  bar.setSeries([series]);
   *  bar.initial(bar.getOptions());
   *
   * @returns {*}
   *!/
  setSeries (seriesObject) {
    if (Helper.isArray(seriesObject)) {
      this.options.series = seriesObject
    } else {
      this.options.series.push(seriesObject)
    }
    return this.options
  }

}

/!**
 * @class
 * @name Charts
 * @description Charts 基类(所有方法由子类实例化并使用)  <br/>
 *              (AMD方式使用时，require进来的echart，需要设置全局访问。如window.echarts = echarts)
 * @example <caption> Uasge of Charts </caption>
 * require(['echart3'],function(echarts){
     *    window.echarts = echarts;
     * })
 *
 * @constructor
 *!/
var Charts = Class.extend({

  /!**
   * @name setSeries
   * @method
   * @memberof Charts
   * @description 设置Series
   * @param {object} seriesObject
   *
   * @example <caption>Usage of Bar</caption>
   *  var bar = Gsui.chart.Bar('bar');
   *  var series = bar.getSeriesObj('最高气温',[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],{color: ['#F46C68']});
   *  bar.setSeries([series]);
   *  bar.initial(bar.getOptions());
   *
   * @returns {*}
   *!/
  setSeries: function (seriesObject) {
    if ($.type(seriesObject) === 'array') {
      this.options.series = seriesObject
    } else {
      this.options.series.push(seriesObject)
    }
    return this.options
  },
  /!**
   * @name setxAxisData
   * @method
   * @memberof Charts
   * @description 设置 横坐标数据
   * @param {array} data
   *
   * @example <caption>Usage of Bar</caption>
   *  var bar = Gsui.chart.Bar('bar');
   *  bar.setxAxisData(['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']);
   *  var series = bar.getSeriesObj('最高气温',[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],{color: ['#F46C68']});
   *  bar.setSeries([series]);
   *  bar.initial(bar.getOptions());
   *
   * @returns {*}
   *!/
  setxAxisData: function (data) {
    this.options.xAxis.data = data || []
    return this.options
  },
  /!**
   * @name setLegend
   * @method
   * @memberof Charts
   * @description 设置 lengend
   * @param {object} legend  legend 对象
   *
   *
   *
   * @returns {*}
   *!/
  setLegend: function (legend) {
    legend = $.extend(true, {}, this.options.legend, legend)
    this.options.legend = legend
    return this.options
  },
  /!**
   * @name setLegendData
   * @method
   * @memberof Charts
   * @description 设置legend data
   * @param {array} legend  legend data 数据
   *
   * @example <caption>Usage of Bar</caption>
   *  var bar = Gsui.chart.Bar('bar');
   *  bar.setLegendData(['最高气温','最低气温']);
   *  bar.setxAxisData(['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']);
   *  var series = bar.getSeriesObj('最高气温',[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],{color: ['#F46C68']});
   *  bar.setSeries([series]);
   *  bar.initial(bar.getOptions());
   *
   * @returns {*}
   *!/
  setLegendData: function (legend) {
    this.options.legend.data = legend || []
    return this.options
  },
  /!**
   * @name setTitle
   * @method
   * @memberof Charts
   * @description 设置title
   * @param {string} text    标题
   * @param {string} subtext 副标题
   * @param {object} titleObject  title 对象
   * @returns {*}
   *!/
  setTitle: function (text, subtext, titleObject) {
    var args = Array.prototype.slice.call(arguments)
    var argumentSize = args.length

    if (argumentSize === 1 && $.type(args[0]) === 'object') {
      this.options.title = $.extend(true, {}, this.options.title, args[0])
    } else if (argumentSize === 1 && $.type(args[0]) === 'string') {
      this.options.title.text = args[0]
    } else if (argumentSize === 2 && $.type(args[0]) === 'string' && $.type(args[1]) === 'string') {
      this.options.title.text = args[0]
      this.options.title.subtext = args[1]
    } else if (argumentSize === 3) {
      this.options.title.text = args[0]
      this.options.title.subtext = args[1]
      this.options.title = $.extend(true, {}, this.options.title, args[2])
    } else {
      Gsui.Log('arguments error')
    }
    return this.options
  },
  /!**
   * @name setOptions
   * @method
   * @memberof Charts
   * @description 设置option
   * @param {object} options options配置项
   *!/
  setOptions: function (options) {
    this.options = $.extend(true, this.options, options)
  },
  /!**
   * @name getOptions
   * @method
   * @memberof Charts
   * @description 获取option
   * @returns {*}
   *!/
  getOptions: function () {
    return this.options
  }
})

/!**
 * @class
 * @name BarChart
 * @description BarChart 类 （不能直接通过new创建实例，请使用Gsui.chart.Bar()）
 * @extend Charts
 * @constructor
 *!/
var BarChart = Charts.extend({
  init: function (target, options) {
    this._super(target, options)
  },
  /!**
   * @name getSeriesObj
   * @method
   * @memberof BarChart
   * @description 获取 Series 对象
   * @param {string} seriesName
   * @param {array} seriesData
   * @param {object} seriesObject
   * @returns {*}
   *!/
  getSeriesObj: function (seriesName, seriesData, seriesObject) {
    var seriesStyle = {
      type: 'bar',
//                markPoint: {
//                    data: [
//                        {type: 'max', name: '最大值'},
//                        {type: 'min', name: '最小值'}
//                    ]
//                },
//                markLine: {
//                    symbol: 'none',
//                    data: [
//                        {type: 'average', name: '平均值'}
//                    ],
//                    animation: false
//                },
      itemStyle: {
        normal: {
          barBorderRadius: [5, 5, 0, 0]
        }
      }
    }
    return this._super(seriesName, seriesData, $.extend(true, seriesStyle, seriesObject))
  }
})

/!**
 * @class
 * @name Linett
 * @description LineChart 类（不能直接通过new创建实例，请使用Gsui.chart.Line()）
 * @extend Charts
 * @constructor
 *!/
var LineChart = Charts.extend({
  init: function (target, options) {
    this._super(target, options)
  },
  /!**
   * @name getSeriesObj
   * @method
   * @memberof LineChart
   * @description 获取 Series 对象
   * @param {string} seriesName
   * @param {array} seriesData
   * @param {object} seriesObject
   * @returns {*}
   *!/
  getSeriesObj: function (seriesName, seriesData, seriesObject) {
    var seriesStyle = {
      type: 'line',
      symbol: 'circle'//,
//                markPoint: {
//                    data: [
//                        {type: 'max', name: '最大值'},
//                        {type: 'min', name: '最小值'}
//                    ]
//                },
//                markLine: {
//                    symbol: 'none',
//                    data: [
//                        {type: 'average', name: '平均值'}
//                    ],
//                    animation: false
//                }
    }
    return this._super(seriesName, seriesData, $.extend(true, seriesStyle, seriesObject))
  }
})
/!**
 * @class
 * @name PieChart
 * @description PieChart 类（不能直接通过new创建实例，请使用Gsui.chart.Pie()）
 * @extend Charts
 * @constructor
 *!/
var PieChart = Charts.extend({
  init: function (target, options) {
    var pieOptions = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      xAxis: null,
      yAxis: null,
      legend: {
        x: 'center',
        y: 'bottom'
      },
      calculable: true,
      grid: null
    }
    this._super(target, $.extend(true, {}, pieOptions, options))
  },
  /!**
   * @name getSeriesObj
   * @method
   * @memberof PieChart
   * @description 获取 Series 对象
   * @param {string} seriesName
   * @param {array} seriesData
   * @param {object} seriesObject
   * @returns {*}
   *!/
  getSeriesObj: function (seriesName, seriesData, seriesObject) {
    // 饼图 Series 样式
    var seriesStyle = {
      type: 'pie',
      color: ['#6FC71E', '#F46C68', '#4FA8FA', '#F09601', '#4AC2EF'],
      radius: '55%',
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
    return this._super(seriesName, seriesData, $.extend(true, seriesStyle, seriesObject))
  }
})
*/
