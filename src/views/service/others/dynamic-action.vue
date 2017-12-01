<template>
  <div class="app-container">
    <div class="filter-container"></div>
    <el-row class="dynam-wrapper">
      <el-col :span="8">
        <el-card class="args-content">
          <div slot="header" class="text-center">参数</div>
          <div class="args-selector">
            <el-select v-model="selCode" placeholder="请选择" @change="refetchServiceParamList">
              <el-option
                v-for="item in selectors"
                :key="item.value"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="service-args-wraper">
            <div class="args-header">业务参数</div>
            <ul class="args-list">
              <li class="args-list-item" v-for="(item, key) in serviceParamList">
                <el-checkbox v-model="item.status"></el-checkbox>
                <span>{{item.name}}</span>
              </li>
            </ul>
          </div>
          <div class="sys-args-wraper">
            <div class="args-header">系统参数</div>
            <ul class="sys-args-list">
              <li class="args-list-item" v-for="(item, key) in systemParamList">
                <el-checkbox v-model="item.status"></el-checkbox>
                <span>{{item.name}}</span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="action-content">
          <div slot="header" class="grid text-center grid-header">
            <div class="grid-col col-6">条件</div>
            <div class="grid-col col-6">动作列表</div>
            <div class="grid-col col-1">
              <el-tooltip content="添加组合查询条件">
                <i style="font-size: 20px" class="el-icon-fa-plus-circle plus-anchor scale2" @click="addCombineCondition"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="action-list">
            <el-card class="action-item grid margin-bottom" :class="{'card-active': currentConsActIndex === index, 'card-disable': currentConsActIndex !== index}" :id="'card--'+index+'-item'"  v-for="(actCon, index) in eventsModel.actsAndCons" :key="index">
              <div class="action-item-sl">
                <div class="action-cond grid-col col-6">
                  <div class="text-center action-cond-item" v-for="(condition, subIndex) in actCon.conditions" :key="subIndex">
                    <span>{{condition.name}}</span>
                    <u-select style="width: 120px;" :ban="currentConsActIndex !== index" :extra="{index, subIndex, paramType: condition.paramType}" v-model="condition.operator" placeholder="请选择" @input="selectOperator" @visibleChange="fetchOperators">
                      <el-option
                        v-for="item in operators"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </u-select>
                    <el-input :disabled="currentConsActIndex !== index" v-for="(cv, cvIndex) in condition.values" :key="cvIndex" style="width: 70px; margin-right: 5px;" v-model="cv.conVal"></el-input>
                    <div class="optbar" :style="{'display': currentConsActIndex !== index ? 'none' : 'inline-block'}">
                      <el-tooltip content="移除条件">
                        <i class="el-icon-fa-minus gap anchor scale2 margin-left" @click="removeCondition(index, subIndex, condition.name, condition.paramType, 'handle')"></i>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
                <div class="action-conf grid-col col-6">
                  <div class="text-center action-conf-item" v-for="(action, subIndex) in actCon.actions" :key="subIndex">
                    <span>{{action.name}} {{subIndex}}</span>
                    <u-select style="width: 120px;" :ban="currentConsActIndex !== index" v-model="action.valueType" placeholder="请选择">
                      <el-option
                        v-for="item in actionTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </u-select>
                    <el-input :disabled="currentConsActIndex !== index"  style="width: 70px;" v-model="action.valueOrExp"></el-input>
                    <div class="optbar" :style="{'display': currentConsActIndex !== index ? 'none' : 'inline-block'}">
                      <el-tooltip content="添加动作">
                        <i class="el-icon-fa-plus-circle  anchor scale2 " @click="addAction(index)"></i>
                      </el-tooltip>
                      <el-tooltip content="移除动作">
                        <i class="el-icon-fa-minus gap anchor scale2 margin-left" @click="removeAction(index, subIndex)"></i>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
                <div class="grid-col col-1 text-left"></div>
              </div>
              <div class="action-plus">
                <el-tooltip content="编辑条件" :style="{'display': currentConsActIndex !== index ? 'inline-block' : 'none'}">
                  <i class="el-icon-fa-edit plus-anchor scale2 margin-left" @click="editCondition(index)"></i>
                </el-tooltip>
                <el-tooltip content="移除组合条件块">
                  <i class="el-icon-fa-trash-o anchor scale2 margin-left" @click="removeCombineCondition(index)"></i>
                </el-tooltip>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="toolbar text-right">
      <el-button type="primary" @click="createEventAction">确定</el-button>
      <el-button type="default">取消</el-button>
    </div>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss">
  @import "dynamic-action";
</style>

<script>
  import assign from 'lodash.assign'
  import uSelect from '@/views/components/select/u-select'
  import * as dynamicService from '@/api/services/others/dynamic'
  export default {
    name: 'dynamic-action',
    data () {
      return {
        selCode: '',
        selectors: [],              // 参数下拉列表
        serviceParamList: [],       // 业务参数列表
        systemParamList: [],        // 系统参数列表
        isInitParamList: false,
        operators: [],              // 操作符列表
        serviceOperators: [],       // 缓存业务操作符列表
        systemOperators: [],        // 缓存系统操作符列表
        actionTypeList: [],         // 动作列表
        currentConsActIndex: 0,     // 当前actsAndCons索引
        isDelCard: false,           // 是否删除actsAndCons 卡片
        isEditStatus: false,        // 是否编辑状态
        systemParamType: 'SYSTEM',
        serviceParamType: 'BIZ',
        eventsModel: {
          code: '',
          name: '',
          status: '',
          description: '',
          actsAndCons: [{
            conditions: [
//              {
//                name: '条件',
//                status: undefined,
//                paramType: '',
//                dataType: '',
//                operator: '',
//                values: [
//                  {
//                    conVal: ''
//                  }
//                ]
//              }
            ],
            actions: [{
              actionId: '',
              name: '操作',
              valueType: '',
              valueOrExp: ''
            }]
          }]
        }
      }
    },
    computed: {
      'actsAndConsSize': function () {
        return this.eventsModel.actsAndCons.length - 1
      }
    },
    components: {uSelect},
    created () {
      this.fetchArgsList()
      this.initSystemParamList()
      this.fetchActionTypeList()
    },
    watch: {
      'serviceParamList': {
        handler: function (paramsList) {
          Array.from(paramsList).forEach((param) => {
            if (this.isInitParamList) return
            if (this.isDelCard) return
            if (this.isEditStatus) return
            const isExist = this.findArgsIndexByNameInActsAndCons(this.currentConsActIndex, param.name)
            if (param.status) { // 激活状态添加到条件块
              if (isExist === -1) {
                this.addCondition(this.currentConsActIndex, param)
                this.fetchOperators(param.paramType)
              }
            } else {
              isExist !== -1 && this.removeCondition(this.currentConsActIndex, isExist, param.name, param.paramType)
            }
          })
          this.isInitParamList = false
          this.isDelCard = false
          this.isEditStatus = false
        },
        deep: true
      },
      'systemParamList': {
        handler: function (paramsList) {
          Array.from(paramsList).forEach((param) => {
            if (this.isInitParamList) return
            if (this.isDelCard) return
            if (this.isEditStatus) return
            const isExist = this.findArgsIndexByNameInActsAndCons(this.currentConsActIndex, param.name)
            if (param.status) { // 激活状态添加到条件块
              isExist === -1 && this.addCondition(this.currentConsActIndex, param)
              this.fetchOperators(param.paramType)
            } else {
              isExist !== -1 && this.removeCondition(this.currentConsActIndex, isExist, param.name, param.paramType)
            }
          })
          this.isInitParamList = false
          this.isDelCard = false
          this.isEditStatus = false
        },
        deep: true
      }
    },
    methods: {
      refetchServiceParamList (val) {
        this.initServiceParamList(val)
      },
      fetchArgsList () {
        dynamicService.fetchCodeList().then(response => {
          this.selectors = response.data.data.records
        })
      },
      // 获取操作符
      fetchOperators (paramType, extras) {
        let type = (typeof paramType === 'string' && paramType) || extras.paramType
        if (!type) return
        if (type === this.serviceParamType) { // 业务操作符
          if (!this.serviceOperators.length) {
            dynamicService.fetchOperatorsList(type).then(response => {
              this.serviceOperators = response.data.data.records
            })
          }
          this.operators = this.serviceOperators
        } else { // 系统操作符
          if (!this.systemOperators.length) {
            dynamicService.fetchOperatorsList(type).then(response => {
              this.systemOperators = response.data.data.records
            })
          }
          this.operators = this.systemOperators
        }
//        dynamicService.fetchOperatorsList(extras.paramType).then(response => {
//          this.operators = response.data.data.records
//        })
      },
      initSystemParamList () {
        dynamicService.fetchSystemParamsList().then(response => {
          this.isInitParamList = true
          this.systemParamList = response.data.data.records
        })
      },
      initServiceParamList (code) {
        dynamicService.fetchServiceParamList(code).then(response => {
          this.isInitParamList = true
          this.serviceParamList = response.data.data.records
        })
      },
      fetchActionTypeList () {
        dynamicService.fetchActionTypeList().then(response => {
          this.actionTypeList = response.data.data.records
        })
      },
      /**
       * 修改参数状态
       * @param index 参数索引
       * @param val
       * @param type  参数类型
       */
      changeArgsListItemStatus (index, val, type) {
        let paramList = type === this.serviceParamType ? this.serviceParamList : this.systemParamList
        paramList[index].status = val
      },
      /**
       * 重置参数状态
       * @param type  参数类型
       */
      resetArgsStatus (type) {
        let paramList = type === this.serviceParamType ? this.serviceParamList : this.systemParamList
        Array.from(paramList).forEach((param) => {
          if (param.status) {
            param.status = false
          }
        })
      },
      // 重置业务参数状态
      resetServiceParamListStatus () {
        this.resetArgsStatus(this.serviceParamType)
      },
      // 重置系统参数状态
      resetSystemParamListStatus () {
        this.resetArgsStatus(this.systemParamType)
      },
      // 重置参数列表状态
      resetArgsListStatus () {
        this.resetServiceParamListStatus()
        this.resetSystemParamListStatus()
      },
      // 从 actions 中获取指定参数名称的索引
      findArgsIndexByNameInActsAndCons (recordIndex, name) {
        let argsIndex = -1
        if (recordIndex !== undefined) {
          Array.from(this.eventsModel.actsAndCons[recordIndex].conditions).some((cons, index) => {
            if (cons.name === name) {
              argsIndex = index
              return true
            }
          })
        } else {
          Array.from(this.eventsModel.actsAndCons).some((actsAndCon, index) => {
            return Array.from(actsAndCon.conditions).some((cons, subIndex) => {
              if (cons.name === name) {
                argsIndex = subIndex
                return true
              }
            })
          })
        }
        return argsIndex
      },
      /**
       * 从参数列表获取指定参数名称的索引
       * @param name
       * @param type  参数类型
       */
      findArgsIndexByNameInParams (name, type) {
        let paramsIndex = -1
        let paramList = type === this.serviceParamType ? this.serviceParamList : this.systemParamList
        Array.from(paramList).some((param, index) => {
          if (param.name === name) {
            paramsIndex = index
            return true
          }
        })
        return paramsIndex
      },
      /**
       * 获取 status == true 状态的 param 参数列表
       */
      findActiveParamsInConditions (index) {
        return Array.from(this.eventsModel.actsAndCons[index || this.currentConsActIndex].conditions).filter((cons, ind) => {
          return cons.status
        })
      },
      /**
       * 初始化某条件块对应的参数列表状态
       * @param index  actsAndCons 中 conditions 的索引
       */
      initParamsStatus (index) {
        let params = this.findActiveParamsInConditions(index)
        Array.from(params).forEach((param, index) => {
          this.changeArgsListItemStatus(this.findArgsIndexByNameInParams(param.name, param.paramType), param.status, param.paramType)
        })
      },
      selectOperator (val, extra) {
        const action = this.eventsModel.actsAndCons[extra.index]
        const item = action.conditions[extra.subIndex]
        if (!item) return
        if (val === 'between' && item.values.length < 2) {
          item.values.push({
            conVal: ''
          })
        } else if (val !== 'between' && item.values.length >= 2) {
          item.values = [{
            conVal: ''
          }]
        }
      },
      createConsAndActsItem (type) {
        const consAndActs = {
          'conditions': {
            name: '条件',
            status: undefined,
            paramType: '',
            dataType: '',
            operator: '',
            values: [
              {
                conVal: ''
              }
            ]
          },
          'actions': {
            actionId: '',
            name: '操作',
            valueType: '',
            valueOrExp: ''
          }
        }
        return type ? consAndActs[type] : consAndActs
      },
      addCombineCondition () {
        const consAndCons = {
          conditions: [],
          actions: [this.createConsAndActsItem('actions')]
        }
        this.eventsModel.actsAndCons.push(consAndCons)
        this.currentConsActIndex = this.actsAndConsSize
        this.resetArgsListStatus()
      },
      removeCombineCondition (index) {
        this.eventsModel.actsAndCons.splice(index, 1)
        this.currentConsActIndex = this.actsAndConsSize
        // 清空后添加空条件块
        this.currentConsActIndex === -1 && this.addCombineCondition()
        // 清空action列表时，初始条件块及状态
        this.resetArgsListStatus()
        this.initParamsStatus(this.currentConsActIndex)
        this.isDelCard = true
      },
      addCondition (index, param) {
        !param.values.length && param.values.push({conVal: ''})
        const mixParams = assign(this.createConsAndActsItem('conditions'), param || {})
        this.eventsModel.actsAndCons[index].conditions.push(mixParams)
      },
      editCondition (index) {
        this.currentConsActIndex = index
        this.isEditStatus = true
        this.resetArgsListStatus()
        this.initParamsStatus(index)
      },
      /**
       * 初始化某条件块对应的参数列表状态
       * @param index
       * @param subIndex
       * @param name
       * @param paramType 参数类型
       * @param optType  操作类型
       */
      removeCondition (index, subIndex, name, paramType, optType) {
        this.eventsModel.actsAndCons[index].conditions.splice(subIndex, 1)
        // 条件块删除条件时，修改参数列表状态
        optType && this.changeArgsListItemStatus(this.findArgsIndexByNameInParams(name, paramType), false, paramType)
      },
      addAction (index) {
        this.eventsModel.actsAndCons[index].actions.push(this.createConsAndActsItem('actions'))
      },
      removeAction (index, subIndex) {
        this.eventsModel.actsAndCons[index].actions.splice(subIndex, 1)
      },
      createEventAction () {
        console.log(this.eventsModel)
        console.log(JSON.stringify(this.eventsModel))
      }
    }
  }
</script>
