<template>
  <div class="app-container">
    <!-- product table list start -->
    <u-table :data="tableData" :columns="columns" :height="utopaTableHeight">
      <div slot="filter">
        <el-form autoComplete="on" :model="listQuery" label-position="left" :inline="true">
          <el-form-item label="品牌类型">
            <el-select clearable class="filter-item" placeholder="" v-model="listQuery.brandId" @visible-change="fetchBrandList">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in brands" :key="item.id" :label="item.sysName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称">
            <el-input style="width: 200px;" class="filter-item" placeholder="产品名称"  v-model="listQuery.productName"></el-input>
          </el-form-item>
          <el-form-item label="页面名称">
            <el-input style="width: 200px;" class="filter-item" placeholder="页面名称"  v-model="listQuery.pageName"></el-input>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input style="width: 200px;" class="filter-item" placeholder="模块名称"  v-model="listQuery.moduleName"></el-input>
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
                      v-model="listQuery.moduleStyle"
                      @focus="chooseStyles"></el-input>
          </el-form-item>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
          <router-link :to="{path: '/service/table/addRecord'}">
            <el-button class="filter-item" type="primary" icon="fa-plus">
              新增
            </el-button>
          </router-link>
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

    <!-- mall's list dialog start -->
    <el-dialog title="选择商场" size="small" :visible.sync="mallsDialogVisible" :close-on-click-modal="false">
      <!-- pick message from table -->
      <u-table :data="mallsList" @row-click="picksMallItem" :columns="mallColumn" :height="350">
        <!-- table picer filter panel-->
        <div slot="filter" style="text-align: right">
          <el-form autoComplete="on" :model="mallQuery" label-position="left" :inline="true">
            <el-form-item>
              <el-input style="width: 200px;" class="filter-item" placeholder="商场名称" v-model="mallQuery.queryName"></el-input>
            </el-form-item>
            <el-button class="filter-item" type="primary" icon="search" @click="handleMallFilter">查询</el-button>
            <el-button class="filter-item" type="primary" icon="plus" @click="handleMallCreate">新增</el-button>
          </el-form>
        </div>
        <div slot="pagination" style="text-align: right">
          <el-pagination
            @size-change="handleMallSizeChange"
            @current-change="handleMallCurrentChange"
            :current-page.sync="mallQuery.pageNo"
            :page-sizes="[10,20,30, 50]"
            :page-size="mallQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mallTotal"></el-pagination>
        </div>
      </u-table>
    </el-dialog>
    <!--  mall's list dialog end -->

    <!-- malls creating dialog start -->
    <el-dialog title="新增商场" size="tiny" :visible.sync="mallsCreateDialogVisible" :close-on-click-modal="false">
      <el-form :inline="true" ref="mallForm" :model="mallModel">
        <el-form-item label="商场名称" prop="name" :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
          <el-input v-model="mallModel.name" placeholder="商场名称"></el-input>
        </el-form-item>
        <el-form-item label="商场位置" prop="location" :rules="{required: true, message: '位置不能为空', trigger: 'blur'}">
          <el-input v-model="mallModel.location" placeholder="商场位置"></el-input>
        </el-form-item>
        <el-form-item label="商场距离">
          <el-input v-model="mallModel.kilometer" placeholder="商场距离"></el-input>
        </el-form-item>
        <el-form-item label="商场评分">
          <el-rate style="margin-top: 6px;" v-model="mallModel.rate" show-text text-color="#ff9900" text-template="{value}"> </el-rate>
        </el-form-item>
        <el-form-item label="主题活动" prop="type">
          <el-checkbox-group v-model="mallModel.themes">
            <el-checkbox label="美食" name="themes" value="1"></el-checkbox>
            <el-checkbox label="地推" name="themes" value="2"></el-checkbox>
            <el-checkbox label="品牌" name="themes" value="3"></el-checkbox>
            <el-checkbox label="线上" name="themes" value="4"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mallsCreateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doCreateMall">确 定</el-button>
      </span>
    </el-dialog>
    <!-- malls creating dialog end -->

    <!-- style selected dialog start -->
    <el-dialog title="选择样式" size="small" :visible.sync="styleDialogVisible" :close-on-click-modal="false">
      <!-- pick message from table -->
      <u-table :data="styleList" :columns="styleColumn" :height="350" @table-selection="getSelectionList"></u-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="styleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSelectStyle">确 定</el-button>
      </span>
    </el-dialog>
    <!-- style selected dialog end -->

    <!-- preview paragraph  start -->
    <el-dialog title="" size="full" class="preview-dialog" :visible.sync="previewDialogVisible">
      <u-preview :magazineId="previewMagazineId" :key="previewKey"></u-preview>
    </el-dialog>
    <!-- preview paragraph end -->
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
  .preview-dialog{
    .el-dialog--full {
      background: rgba(0, 0, 0, 0.9);
    }
  }
  .text-decoration{
    color: #999;
    text-decoration: underline;
  }
</style>
<script>
  import uTable from '@/components/table/uTable'
  import * as configModule from '@/api/basic/configure/module'
  import { deleteSpicyLeader } from '@/api/merchants/spicyleader'
  import { fetchMallsList, createMall, fetchStyleList } from '@/api/malls'
  import { fetchClientTypes } from '@/api/common/platform'
  import { EXCEPTION_STATUS_DESC_MAP, PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
  import { Utopa } from '@/common/utopa'
  import { success, error, info } from '@/utils/dialog'

  import uPreview from './preview.vue'

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
            align: 'left',
            template: function (row) {
              return '<a class="link"><i class="el-icon-fa-adjust" style="margin-right: 5px; color: #777777;"></i>' + row.productName + '</a>'
            },
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
            prop: 'moduleName',
            showOverflowTooltip: true,
            className: 'text-decoration'
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
              return cellValue ? '是' : '否'
            }
          },
//          {
//            label: '审核',
//            prop: 'isAudit',
//            template: function (row, that) {
//              const type = {
//                0: 'gray',
//                1: 'primary'
//              }
//              const label = {
//                0: '未通过',
//                1: '通过'
//              }
//              return '<el-tag type="' + type[row.isAudit] + '">' + label[row.isAudit] + '</el-tag>'
//            }
//          },
          {
            label: '更新时间',
            prop: 'updateTime',
            sortable: true
          },
          {
            label: '更新人',
            prop: 'updator'
          },
          {
            label: '操作',
            operations: [
              {
                label: '预览',
                type: 'default',
                func: this.preview
              },
              {
                label: '删除',
                func: this.remove,
                funcArgs: {}
              }
            ]
          }
        ],
        listQuery: {
          productId: '',
          productName: '',
          pageId: '',
          pageName: '',
          brandId: undefined,
          mallId: undefined,
          mallName: '',
          moduleName: '',
          updateTime: '',
          moduleStyle: '',
          status: undefined,
          pageNo: PAGINATION_PAGENO,                // 页码
          pageSize: PAGINATION_PAGESIZE              // 页数
        },
        // --------- malls about -----------------
        mallsDialogVisible: false,
        mallTotal: 0,
        mallsList: [],
        mallColumn: [
          {
            label: '#',
            prop: 'id',
            width: 150
          },
          {
            label: '商场名称',
            prop: 'name'
          },
          {
            label: '商场位置',
            prop: 'location',
            width: 250
          },
          {
            label: '商场距离',
            prop: 'kilometer'
          }
        ],
        mallQuery: {
          productName: '',
          pageNo: PAGINATION_PAGENO,                // 页码
          pageSize: PAGINATION_PAGESIZE
        },
        mallsCreateDialogVisible: false,
        mallModel: {
          name: '',
          location: '',
          kilometer: '',
          themes: [],
          rate: 2.5
        },
        // --------- styles about -----------------
        styleDialogVisible: false,
        styleList: [],
        selectionList: [],
        styleColumn: [
          {
            type: 'selection'
          },
          {
            label: '#',
            prop: 'id',
            width: 150
          },
          {
            label: '样式名称',
            prop: 'name'
          },
          {
            label: '样式内容',
            prop: 'content'
          }
        ],
        // ------------ preview dialog -------------------
        previewDialogVisible: false,
        previewModel: {},
        previewKey: undefined,
        previewMagazineId: undefined,
        previewVoteId: undefined,
        // ------------- filter about ---------------------
        brands: []
      }
    },
    props: {},
    components: {
      uTable,
      uPreview
    },
    filters: {},
    created () {
      this.getList()
    },
    mounted () {
      console.log(this.$t('lang.message.hello'))
      this.fixLayout()
      window.onresize = () => {
        return (() => {
          this.fixLayout()
        })()
      }
    },
    watch: {
      // reset the form's fields validation when dialog closed
      mallsCreateDialogVisible (val) {
        if (val === false) {
          this.$refs.mallForm.resetFields()
        }
      },
      previewDialogVisible (val) {
        if (val === true) {
          this.previewKey = this.previewMagazineId + Math.random() * 10
        }
      }
    },
    methods: {
      // set specified height to the table
      fixLayout () {
        const body = document.body
        const mainHeader = document.querySelector('.main-header')
        const crumbNav = document.querySelector('.breadcrumb-nav')
        const filterContainer = document.querySelector('.filter-container')
        let pagination = document.querySelector('.pagination-container')
        this.utopaTableHeight = body.clientHeight - mainHeader.clientHeight * 2 - crumbNav.clientHeight - filterContainer.clientHeight - pagination.clientHeight - 10
      },
      // fetch product list form server
      getList () {
        configModule.fetchConfigureList(this.listQuery).then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.tableData = result.data.infos
            this.total = result.data.total
          } else {
            error(result.msg || EXCEPTION_STATUS_DESC_MAP[result.code] || '获取失败')
          }
          this.listLoading = false
        }).catch(err => {
          error(EXCEPTION_STATUS_DESC_MAP[err.code] || '获取数据失败')
        })
      },
      // dynamic fetching brand list
      fetchBrandList () {
        if (!this.brands.length) {
          fetchClientTypes().then((response) => {
            const result = response.data
            if (Utopa.isValidRequest(response)) {
              this.brands = result.data.sysList || []
            }
          })
        }
      },
      resetProductListQuery () {
        this.listQuery = {
          productId: '',
          productName: '',
          pageId: '',
          pageName: '',
          brandId: undefined,
          mallId: undefined,
          mallName: '',
          moduleName: '',
          updateTime: '',
          moduleStyle: '',
          status: undefined,
          pageNo: PAGINATION_PAGENO,                // 页码
          pageSize: PAGINATION_PAGESIZE
        }
      },
      handleFilter () {
        this.listQuery.pageNo = PAGINATION_PAGENO
        this.getList()
      },
      handleRefresh () {
        this.resetProductListQuery()
        this.getList()
      },
      // show the dialog when focusing the mall's input
      chooseMalls () {
        this.mallsDialogVisible = true
        this.getMallsList()
      },
      picksMallItem (row, event, column) {
        this.mallsDialogVisible = false
        this.listQuery.mallId = row.id
        this.listQuery.mallName = row.name
      },
      // operation about
      preview (row) {
        this.previewMagazineId = row.id
        this.previewVoteId = row.voteId
        this.previewDialogVisible = true
      },
      remove (row, args) {
        const _this = this
        this.$confirm('删除记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSpicyLeader(row.id).then((response) => {
            if (Utopa.isValidRequest(response)) {
              success('删除成功!')
              _this.handleRefresh()
            } else {
              error('删除失败')
            }
          })
        }).catch(() => {
          info('已取消删除')
        })
      },
      // pagination about
      handleSizeChange (pageSize) {
        this.listQuery.pageSize = pageSize
        this.getList()
      },
      handleCurrentChange (pageNo) {
        this.listQuery.pageNo = pageNo
        this.getList()
      },
      // ------------- mall's query about ------------------
      getMallsList () {
        fetchMallsList().then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.mallsList = result.data.infos
            this.mallTotal = result.data.total
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[result.code] || '获取失败')
          }
        })
      },
      // search handler
      handleMallFilter () {
        this.mallQuery.pageNo = PAGINATION_PAGENO
        this.getMallsList()
      },
      // show create dialog
      handleMallCreate () {
        this.mallsCreateDialogVisible = true
      },
      // post a request
      doCreateMall () {
        this.$refs.mallForm.validate(valid => {
          if (valid) {
            createMall().then(response => {
              if (Utopa.isValidRequest(response)) {
                success('创建成功')
              }
              this.getMallsList()
              this.mallsCreateDialogVisible = false
            }).catch(err => {
              error('创建失败')
              console.log(err)
            })
          }
        })
      },
      handleMallSizeChange (pageSize) {
        this.mallQuery.pageSize = pageSize
        this.getMallsList()
      },
      handleMallCurrentChange (pageNo) {
        this.mallQuery.pageNo = pageNo
        this.getMallsList()
      },
      // ---------- style about ------------------------
      doSelectStyle () {
        this.styleDialogVisible = false
        this.listQuery.moduleStyle = this.selectionList.map((item, key) => {
          return item.name
        }).join(',')
      },
      getSelectionList (val) {
        this.selectionList = val
      },
      chooseStyles () {
        this.styleDialogVisible = true
        this.getStyleList()
      },
      getStyleList () {
        fetchStyleList().then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.styleList = result.data.infos
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[result.code] || '获取失败')
          }
        })
      }
    }
  }
</script>
