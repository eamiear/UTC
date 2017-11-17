<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form autoComplete="on" :model="listQuery" label-position="left" :inline="true">
        <el-form-item label="产品名称">
          <el-select clearable class="filter-item" placeholder="" v-model="listQuery.productId" @visible-change="fetchClientTypeList">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in products" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="页面名称">
          <el-select clearable class="filter-item" placeholder="" v-model="listQuery.pageId" @visible-change="fetchClientTypeList">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in pages" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="模块名称">
          <el-input style="width: 200px;" class="filter-item" placeholder="模块名称" v-model="listQuery.moduleName"></el-input>
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
            <el-option v-for="(value, key) in userState" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附近商场">
          <el-input style="width: 200px;" class="filter-item" placeholder="附近商场" v-model="listQuery.mallName" @focus="chooseMalls"></el-input>
        </el-form-item>

        <el-form-item label="模块样式">
          <el-input style="width: 200px;" class="filter-item" placeholder="模块样式" v-model="listQuery.moduleStyle"></el-input>
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
      </el-form>
    </div>
    <div class="filter-container text-right">
      <el-button class="filter-item" type="primary" icon="fa-plus" @click="handleCreate">新增</el-button>
      <el-button class="filter-item" type="primary" icon="fa-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <el-table
      id="userlist"
      class="utable-container"
      :key='tableKey'
      :data="list"
      v-loading="listLoading"
      border fit highlight-current-row
      align="center"
      :height="utopaTableHeight"
      style="width: 100%">

      <el-table-column align="center" label="产品名称">
        <template scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="页面名称">
        <template scope="scope">
          <span>{{scope.row.pageName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="模块名称">
        <template scope="scope">
          <span>{{scope.row.moduleName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="模块编号">
        <template scope="scope">
          <span>{{scope.row.moduleNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="模块样式">
        <template scope="scope">
          <span>{{scope.row.moduleStyle}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="排序号">
        <template scope="scope">
          <span>{{scope.row.order}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否显示">
        <template scope="scope">
          <span>{{scope.row.isShow}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新人">
        <template scope="scope">
          <span>{{scope.row.updator}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" min-width="150px">
        <template scope="scope">
          <el-button size="small" @click="handleUserAvailable(scope.row, 'disable')">编辑</el-button>
          <el-button type="danger" size="small" @click="handleResetPassword(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- pagination start -->
    <div v-show="!listLoading" class="pagination-container text-right">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNo"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
    <!-- pagination end -->

    <!-- create new user -->
    <el-dialog title="添加用户" size="tiny" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form class="small-space" autoComplete="on" :model="userModel" :rules="userModelRules" ref="userModelForm" label-position="left" label-width="70px" style='width: 60%; margin-left:50px;'>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userModel.mobile"></el-input>
        </el-form-item>
        <el-form-item label="密  码" prop="password">
          <el-input v-model="userModel.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
    <!-- end create user -->

    <el-dialog title="选择商场" size="small" :visible.sync="mallsDialogVisible" :close-on-click-modal="false">
      <table-picker :data="mallsList" @row-click="picksMallItem" :height="350">
        <div slot="columns">
          <el-table-column align="left" label="商场距离" prop="kilometer"></el-table-column>
          <el-table-column align="left" label="#" type="index" width="50"></el-table-column>
          <el-table-column align="left" label="商场名称" prop="name"></el-table-column>
          <el-table-column align="left" label="商场位置" prop="location"></el-table-column>
        </div>
        <div slot="pagination" style="text-align: right">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page.sync="listQuery.pageNo"
                         :page-sizes="[10,20,30, 50]"
                         :page-size="listQuery.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total"></el-pagination>
        </div>
      </table-picker>
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
    .utable-container{
      width: 100%;
      margin-top: 10px;
    }
    .pagination-container{
      margin-top: 5px;
    }
  }
</style>

<script>
  import * as userService from '@/api/system/user'
  import * as platService from '@/api/common/platform'
  import * as configModule from '@/api/basic/configure/module'
  import { success, error } from '@/utils/dialog'
  //  import { validateMobilephone } from '@/utils/validate'
  import { EXCEPTION_STATUS_DESC_MAP, CLIENT_TYPES_MAP, PAGINATION_PAGENO, PAGINATION_PAGESIZE, PAGINATION_PAGETOTAL } from '@/common/constants'
  import { Helper } from '@/common/helper'
  import { Utopa } from '@/common/utopa'
  import tablePicker from './tablePicker.vue'

  export default {
    name: 'userList',
    data () {
      const validateUserModel = (rule, value, callback) => {
        if (!value) {
          callback(new Error(rule.field + '不能为空'))
        } else {
          callback()
        }
      }
      const validateMobilePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号码不能为空'))
        } else {
          callback()
        }
        /* else if (validateMobilephone(value)) {
             callback(new Error('手机号不合法'))
           }*/
      }
      return {
        listLoading: true,
        total: PAGINATION_PAGETOTAL,
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
        dialogFormVisible: false,   // 添加用户弹窗状态
        tableKey: 0,
        utopaTableHeight: 0,        // 表格高度
        list: [],             // 表格数据信息
        userModel: {          // 用户模型
          password: '',
          mobile: '',
          sysId: ''
        },
        userModelRules: {   // 用户检验规则
          mobile: [{ required: true, message: '手机号不能为空', validator: validateMobilePhone }],
          password: [{ required: true, message: '密码不能为空', validator: validateUserModel }]
        },
        userState: { // 用户状态
          1: '启用',
          2: '禁用'
        },
        products: [],
        pages: [],
        clientTypes: [],         // 平台类型
        // malls
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
        ]
      }
    },
    components: {
      tablePicker
    },
    filters: {
      dateTimeFormat (datetime) {
        return datetime && Helper.parseTime(datetime)
      },
      clientTypeFormat (type) {
        return type && CLIENT_TYPES_MAP[type]
      },
      interestListFormat (interest) {
        return interest && interest.map((item, index) => {
          return item.description
        }).join(',')
      },
      sexFormat (sex) {
        return sex && {1: '男', 2: '女'}[sex]
      }
    },
    created () {
      this.getList()
    },
    watch: {
      'listQuery.updateTime' (val) {
        const beginTime = this.listQuery.registerTime[0]
        const endTime = this.listQuery.registerTime[1]
        this.listQuery.beginTime = beginTime && Helper.parseTime(beginTime)
        this.listQuery.endTime = endTime && Helper.parseTime(endTime)
      },
      dialogFormVisible (val) {
        if (val === false) {
          this.$refs.userModelForm.resetFields()
        }
      }
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
        this.utopaTableHeight = body.clientHeight - mainHeader.clientHeight * 2 - crumbNav.clientHeight - filterContainer.clientHeight * 2 - pagination.clientHeight - 50
      },
      // 获取列表
      getList () {
        this.listLoading = true
        configModule.fetchConfigureList(this.listQuery).then(response => {
          const result = response.data
          if (Utopa.isValidRequest(response)) {
            this.list = result.data.infos
            this.total = result.data.total || PAGINATION_PAGETOTAL
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[result.code] || '获取失败')
          }
          this.listLoading = false
        }).catch(err => {
          error(EXCEPTION_STATUS_DESC_MAP[err.code] || '获取数据失败')
          this.listLoading = false
        })
      },
      // 获取来源列表
      fetchClientTypeList () {
        if (!this.clientTypes.length) {
          platService.fetchClientTypes().then((response) => {
            const result = response.data
            if (Utopa.isValidRequest(response)) {
              this.clientTypes = result.data.sysList || []
            } else {
              error(EXCEPTION_STATUS_DESC_MAP[result.code] || '获取客户端类型列表失败')
            }
          })
        }
      },
      // 条件查询
      handleFilter () {
        this.listQuery.pageNo = PAGINATION_PAGENO
        this.getList()
      },
      // 新增用户
      handleCreate (row) {
        this.resetUserModel()
        this.dialogFormVisible = true
      },
      handleResetPassword () {
        success('接口待提供')
      },
      chooseMalls () {
        this.mallsDialogVisible = true
      },
      picksMallItem (row, event, column) {
        // todo
        this.mallsDialogVisible = false
        this.listQuery.mallId = row.id
        this.listQuery.mallName = row.name
      },
      // refresh user lilst
      handleRefresh () {
        this.resetListQuery()
        this.getList()
      },
      // 启用/禁用用户
      handleUserAvailable (row, action) {
        const actionMap = {
          'disable': userService.disableUser,
          'enable': userService.enableUser
        }
        actionMap[action].call(null, row.uid).then(response => {
          if (Utopa.isValidRequest(response)) {
            this.getList()
            success(action === 'enable' ? '启用成功' : '禁用成功')
          } else {
            error(EXCEPTION_STATUS_DESC_MAP[response.data.code] || action === 'enable' ? '启用失败!' : '禁用失败!')
          }
        })
      },
      // pagination change current page
      handleCurrentChange (pageNo) {
        this.listQuery.pageNo = pageNo
        this.getList()
      },
      // pagination change page size
      handleSizeChange (pageSize) {
        this.listQuery.pageSize = pageSize
        this.getList()
      },
      // 重置弹窗表单
      resetUserModel () {
        this.userModel = {
          password: '',
          mobile: '',
          sysId: ''
        }
      },
      // 重置查询列表
      resetListQuery () {
        this.listQuery = {
          mobile: '',
          beginTime: '',
          endTime: '',
          registerTime: '',
          sysId: undefined,
          state: undefined,
          pageNo: PAGINATION_PAGENO,
          pageSize: PAGINATION_PAGESIZE
        }
      },
      // 新增业务操作
      create () {
        const _this = this
        _this.$refs.userModelForm.validate(valid => {
          if (valid) {
            userService.createUser(_this.userModel).then((response) => {
              const result = response.data
              Utopa.isValidRequest(response) ? _this.getList() : error(EXCEPTION_STATUS_DESC_MAP[result.code] || '添加失败!')
              _this.dialogFormVisible = !Utopa.isValidRequest(response)
            }).catch((err) => {
              error('新增失败')
              console.log('createUser fail: ', err)
              _this.dialogFormVisible = false
            })
          }
        })
      }
    }
  }
</script>
