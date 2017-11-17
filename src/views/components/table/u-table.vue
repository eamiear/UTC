<template>
  <div class="app-container">
    <u-table :data="tableData" :columns="columns"></u-table>
  </div>
</template>

<script>
  import uTable from '@/components/table/uTable'
  import * as configModule from '@/api/basic/configure/module'
  import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'
  import { Utopa } from '@/common/utopa'
  import { success, error } from '@/utils/dialog'

  export default {
    name: 'base',
    data () {
      return {
        tableData: [],
        columns: [{
          label: '产品名称',
          prop: 'productName',
          width: 150
        }, {
          label: '页面名称',
          prop: 'pageName',
          width: 180,
          formatter: function (row, column, cellValue) {
            return cellValue.length > 14 ? cellValue.slice(0, 14) + '...' : cellValue
          }
        }, {
          label: '模块名称',
          prop: 'moduleName'
        }, {
          label: '模块编号',
          prop: 'moduleNo'
        }, {
          label: '模块样式',
          prop: 'moduleStyle'
        }, {
          label: '排序号',
          prop: 'order'
        }, {
          label: '是否显示',
          prop: 'isShow',
          formatter: function (row, column, cellValue) {
            return cellValue
          }
        }, {
          label: '更新时间',
          prop: 'updateTime'
        }, {
          label: '更新人',
          prop: 'updator'
        }, {
          label: '操作',
          width: 300,
          operations: [{
            label: '预览',
            type: 'default',
            func: this.preview
          }, {
            label: '编辑',
            type: 'success',
            func: this.edit
          }, {
            label: '删除',
            func: this.remove
          }]
        }]
      }
    },
    props: {},
    components: {
      uTable
    },
    filters: {},
    created () {
      this.getList()
    },
    mounted () {},
    methods: {
      getList () {
        configModule.fetchConfigureList(this.listQuery).then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.tableData = result.data.infos
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[result.code] || '获取失败')
          }
          this.listLoading = false
        }).catch(err => {
          error(EXCEPTION_STATUS_DESC_MAP[err.code] || '获取数据失败')
        })
      },
      preview () {
        success('preview')
      },
      edit () {
        success('edit')
      },
      remove () {
        success('remove')
      }
    }
  }
</script>
