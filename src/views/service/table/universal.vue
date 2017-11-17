<template>
  <div class="app-container">
    <!-- product table list start -->
    <u-table :data="tableData" :columns="columns" :height="utopaTableHeight">
      <div slot="filter">
        <el-form autoComplete="on" :model="listQuery" label-position="left" :inline="true">
          <el-form-item label="产品名称">
            <el-select clearable class="filter-item" placeholder="" v-model="listQuery.productId">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in products" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="页面名称">
            <el-select clearable class="filter-item" placeholder="" v-model="listQuery.pageId">
              <el-option label="全部" value=""></el-option>
              <el-option :key="1" label="Home" value="1"></el-option>
              <el-option :key="2" label="Dashboard" value="2"></el-option>
              <el-option :key="3" label="Admin" value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模块名称">
            <el-input style="width: 200px;" class="filter-item" placeholder="模块名称"
                      v-model="listQuery.moduleName"></el-input>
          </el-form-item>

          <el-form-item label="更新时间">
            <el-date-picker
              v-model="listQuery.updateTime"
              type="datetime"
              placeholder="选择更新时间">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="显示状态">
            <el-select clearable class="filter-item" v-model="listQuery.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="显示" :value="1"></el-option>
              <el-option label="隐藏" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="附近商场">
            <el-input style="width: 200px;" class="filter-item" placeholder="附近商场" v-model="listQuery.mallName"
                      @focus="chooseMalls"></el-input>
          </el-form-item>

          <el-form-item label="模块样式">
            <el-input style="width: 200px;" class="filter-item" placeholder="模块样式"
                      v-model="listQuery.moduleStyle"></el-input>
          </el-form-item>

          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="plus" @click="handleFilter">新增</el-button>
          <el-button class="filter-item" type="primary" icon="refresh" @click="handleRefresh">刷新</el-button>
        </el-form>
      </div>
      <div slot="pagination" style="text-align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.pageNo"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"></el-pagination>
      </div>
    </u-table>
    <!-- product table list end -->

    <el-dialog title="选择商场" size="small" :visible.sync="mallsDialogVisible" :close-on-click-modal="false">
      <!-- pick message from table -->
      <u-table :data="mallsList" @row-click="picksMallItem" :columns="mallColumn" :height="350"></u-table>
    </el-dialog>
  </div>
</template>
<style lang="scss">
  .app-container{
    padding: 10px;

    .filter-container{
      .el-button{
        margin-left: 10px;
      }
    }
    .utopa-table-container{
      width: 100%;
      margin-top: 10px;
    }
    .pagination-container{
      margin-top: 5px;
    }
  }
</style>
<script>
  import uTable from '@/components/table/uTable'
  import * as configModule from '@/api/basic/configure/module'
  import { EXCEPTION_STATUS_DESC_MAP, PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
  import { Utopa } from '@/common/utopa'
  import { success, error } from '@/utils/dialog'

  export default {
    name: 'base',
    data () {
      return {
        total: 0,
        utopaTableHeight: 0,
        tableData: [],
        columns: [
          {
            label: '产品名称',
            prop: 'productName',
            width: 150
          },
          {
            label: '页面名称',
            prop: 'pageName',
            width: 180,
            style: {'color': 'rgba(17, 17, 212, 0.9);'},
            formatter: function (row, column, cellValue) {
              return cellValue.length > 14 ? cellValue.slice(0, 14) + '...' : cellValue
            }
          },
          {
            label: '模块名称',
            prop: 'moduleName'
          },
          {
            label: '模块编号',
            prop: 'moduleNo'
          },
          {
            label: '模块样式',
            prop: 'moduleStyle'
          },
          {
            label: '排序号',
            prop: 'order'
          },
          {
            label: '是否显示',
            prop: 'isShow',
            formatter: function (row, column, cellValue) {
              return cellValue
            }
          },
          {
            label: '更新时间',
            prop: 'updateTime'
          },
          {
            label: '更新人',
            prop: 'updator'
          },
          {
            label: '操作',
            width: 300,
            operations: [
              {
                label: '预览',
                type: 'default',
                func: this.preview
              },
              {
                label: '编辑',
                type: 'success',
                func: this.edit
              },
              {
                label: '删除',
                func: this.remove
              }
            ]
          }
        ],
        listQuery: {
          productId: '',
          pageId: '',
          mallId: undefined,
          mallName: '',
          moduleName: '',
          updateTime: '',
          status: undefined,
          pageNo: PAGINATION_PAGENO,                // 页码
          pageSize: PAGINATION_PAGESIZE              // 页数
        },
        // malls about
        mallsDialogVisible: false,
        mallsList: [
          {
            'id': 1,
            'name': '奥体',
            'location': '体育西路',
            'kilometer': '20km'
          },
          {
            'id': 2,
            'name': '优托邦',
            'location': '长兴',
            'kilometer': '20km'
          },
          {
            'id': 3,
            'name': '高德置地',
            'location': '体育西路122号',
            'kilometer': '20km'
          },
          {
            'id': 4,
            'name': '科学城高德置地',
            'location': '科学城高德置地100号',
            'kilometer': '20km'
          },
          {
            'id': 5,
            'name': '科学城高德置地12',
            'location': '科学城高德置地100号123',
            'kilometer': '20km'
          },
          {
            'id': 6,
            'name': '科学城高德置地243',
            'location': '科学城高德置地100号2324',
            'kilometer': '20km'
          }
        ],
        mallColumn: [
          {
            label: '#',
            prop: 'id',
            width: 50
          },
          {
            label: '商场名称',
            prop: 'name'
          },
          {
            label: '商场位置',
            prop: 'location'
          },
          {
            label: '商场距离',
            prop: 'kilometer'
          }
        ],
        // filter about
        products: [
          {
            id: 1,
            name: '产品A'
          },
          {
            id: 2,
            name: '产品B'
          },
          {
            id: 3,
            name: '产品C'
          },
          {
            id: 4,
            name: '产品D'
          },
          {
            id: 5,
            name: '产品E'
          }
        ]
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
    mounted () {
      this.fixLayout()
      window.onresize = () => {
        return (() => {
          this.fixLayout()
        })()
      }
    },
    methods: {
      fixLayout () {
        const body = document.body
        const mainHeader = document.querySelector('.main-header')
        const crumbNav = document.querySelector('.breadcrumb-nav')
        const filterContainer = document.querySelector('.filter-container')
        let pagination = document.querySelector('.pagination-container')
        this.utopaTableHeight = body.clientHeight - mainHeader.clientHeight * 2 - crumbNav.clientHeight - filterContainer.clientHeight - pagination.clientHeight - 10
      },
      getList () {
        configModule.fetchConfigureList(this.listQuery).then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.tableData = result.data.infos
            this.total = result.data.total
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[result.code] || '获取失败')
          }
          this.listLoading = false
        }).catch(err => {
          error(EXCEPTION_STATUS_DESC_MAP[err.code] || '获取数据失败')
        })
      },
      resetListQuery () {
        // todo reset listQuery
      },
      handleFilter () {
        this.listQuery.pageNo = PAGINATION_PAGENO
        this.getList()
      },
      handleRefresh () {
        this.resetListQuery()
        this.getList()
      },
      // malls about
      chooseMalls () {
        this.mallsDialogVisible = true
      },
      picksMallItem (row, event, column) {
        // todo
        this.mallsDialogVisible = false
        this.listQuery.mallId = row.id
        this.listQuery.mallName = row.name
      },
      // operation about
      preview () {
        success('preview')
      },
      edit () {
        success('edit')
      },
      remove () {
        success('remove')
      },
      // pagination about
      handleSizeChange (pageSize) {
        this.listQuery.pageSize = pageSize
        this.getList()
      },
      handleCurrentChange (pageNo) {
        this.listQuery.pageNo = pageNo
        this.getList()
      }
    }
  }
</script>
