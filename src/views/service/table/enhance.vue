<template>
  <div class="app-container">
    <!-- product table list start -->
    <u-table :data="tableData"
             :columns="columns"
             :height="utopaTableHeight"
             @selection-change="selsChange"
             @cell-mouse-enter="handleCellMouseEnter"
             @cell-mouse-leave="handleCellMouseLeave">
      <div slot="filter">
        <el-form autoComplete="on" :model="listQuery"  label-position="left" :inline="true">
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
            <!--<el-input style="width: 200px;" class="filter-item" placeholder="模块名称"  v-model="listQuery.moduleName"></el-input>-->
            <el-autocomplete
              v-model="listQuery.moduleName"
              :fetch-suggestions="querySearchAsync"
              placeholder="输入模块名称"
              @select="handleSelectModuleName"
            ></el-autocomplete>
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

      <el-button slot="toobar-action" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
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
      <u-table :data="styleList" :columns="styleColumn" :height="350" @selection-change="getSelectionList"></u-table>
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

    <!-- thumbnail wrapper start -->
    <div class="thumbnail" :class="{'active': isShowThumbnail, 'disactive': !isShowThumbnail}">
      <p class="thumbnail-header"></p>
      <div class="thumbnail-content">
        <img v-if="thumbnailUrl" :src="thumbnailUrl" alt="thumbnail">
      </div>
      <div class="thumbnail-footer"></div>
    </div>
    <!-- thumbnail wrapper end-->
  </div>
</template>
<style lang="scss">
  @import "scss/enhance";
</style>
<script>
  import uTable from '@/components/table/uTable'
  import * as configModule from '@/api/basic/configure/module'
  import { deleteSpicyLeader } from '@/api/merchants/spicyleader'
  import { fetchMallsList, createMall, fetchStyleList } from '@/api/malls'
  import { fetchClientTypes } from '@/api/common/platform'
  import { fetchModuleNames } from '@/api/services/table/enhance'
  import { EXCEPTION_STATUS_DESC_MAP, PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
  import { Utopa } from '@/common/utopa'
  import { success, error, info } from '@/utils/dialog'

  import uPreview from './preview.vue'

  export default {
    name: 'base',
    data () {
      const vm = this
      return {
        total: 0,
        utopaTableHeight: 0,
        sels: [],
        moduleNamesSet: [],
        moduleNameTimeout: null,
        tableData: [],
        columns: [
          {
            type: 'selection'
          },
          {
            label: '产品名称',
            align: 'left',
            template: function (row) {
              return '<a class="link"><i class="el-icon-fa-adjust" style="margin-right: 5px; color: #777777;"></i>' + row.productName + '</a>'
            },
            width: 150,
            func: function (row) {
              vm.$router.push({path: '/service/table/detail/' + row.id, query: {imt: true, tn: row.productName}})
            }
          },
          {
            label: '缩略图',
            align: 'center',
            template: function (row) {
              return '<a class="inline-block padding-small"><img class="image image-tiny" src="' + row.thumbnail + '" alt="thumbnail"/></a>'
            }
          },
          {
            label: '页面名称',
            prop: 'pageName',
            width: 180,
            style: {'color': 'rgba(17, 17, 212, 0.9);'},
            formatter: function (row, column, cellValue) {
              return cellValue.length > 10 ? cellValue.slice(0, 9) + '...' : cellValue
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
        brands: [],
        // ------------- thumbnails about ---------------
        isShowThumbnail: false,
        thumbnailUrl: '',
        thumbnailEl: ''
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
      this.fixLayout()
      window.onresize = () => {
        return (() => {
          this.fixLayout()
        })()
      }
      this.fetchModuleNames()
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
        this.utopaTableHeight = body.clientHeight - mainHeader.clientHeight * 2 - crumbNav.clientHeight - filterContainer.clientHeight - pagination.clientHeight - 20
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
      fetchModuleNames () {
        fetchModuleNames().then(response => {
          this.moduleNamesSet = response.data.data.records
        })
      },
      querySearchAsync (queryString, cb) {
        let moduleNamesSet = this.moduleNamesSet
        const results = queryString ? moduleNamesSet.filter(this.createStateFilter(queryString)) : moduleNamesSet
        clearTimeout(this.moduleNameTimeout)
        this.moduleNameTimeout = setTimeout(() => {
          cb(results)
        }, 3000 * Math.random())
      },
      createStateFilter (queryString) {
        return (state) => {
          return (state.value.indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelectModuleName (item) {
        console.log('autocomplete moduleNames: ', item)
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
      selsChange: function (sels) {
        this.sels = sels
      },
      batchRemove () {
        const ids = this.sels.map(item => item.id).toString()
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let para = { ids: ids }
          configModule.batchRemove(para).then((res) => {
            this.listLoading = false
            success('删除成功')
            this.getList()
          })
        }).catch(() => {
        })
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
      },
      // thumbnails handler
      handleCellMouseEnter (row, column, cell, event) {
        if (!event.currentTarget.className.includes('el-table_1_column_3')) return
        this.thumbnailEl = this.thumbnailEl || document.querySelector('.thumbnail')
        const tableWrapHeight = event.fromElement.clientHeight
        this.isShowThumbnail = true
        this.thumbnailUrl = row.thumbnail
        const thumbnailHeight = this.thumbnailEl.clientHeight
        const offsetY = event.y + thumbnailHeight - tableWrapHeight > 0 ? event.y + (tableWrapHeight - thumbnailHeight) + cell.clientHeight / 2 : event.y - cell.clientHeight
        this.thumbnailEl.style.left = (event.x + cell.clientWidth * 5 / 6) + 'px'
        this.thumbnailEl.style.top = offsetY + 'px'
      },
      handleCellMouseLeave (row, column, cell, event) {
        this.thumbnailEl = this.thumbnailEl || document.querySelector('.thumbnail')
        this.isShowThumbnail = false
        this.thumbnailUrl = ''
//        this.thumbnailEl.style.left = ''
//        this.thumbnailEl.style.top = ''
      }
    }
  }
</script>
