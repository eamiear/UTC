<template>
  <div class="app-container">
    <div class="filter-container"></div>
    <el-row class="dynam-wrapper">
      <el-col :span="8">
        <el-card class="args-content">
          <div slot="header" class="text-center">参数</div>
          <div class="args-selector">
            <el-select v-model="argSelector" placeholder="请选择">
              <el-option
                v-for="item in selectors"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <ul class="args-list">
            <li class="args-list-item" v-for="(item, key) in eventsModel.params">
              <el-checkbox v-model="item.status"></el-checkbox>
              <span>{{item.name}}</span>
            </li>
          </ul>
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
            <el-card class="action-item grid margin-bottom"  v-for="(action, index) in eventsModel.actions" :key="index">
              <div class="action-item-sl" v-for="(item, subIndex) in action.items" :key="subIndex">
                <div class="action-cond grid-col col-6">
                  <div class="text-center">
                    <span>{{item.conditions.name}} {{subIndex}}</span>
                    <u-select style="width: 120px;" :extra="{index, subIndex}" v-model="item.conditions.operator" placeholder="请选择" @input="selectOperator">
                      <el-option
                        v-for="item in operators"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </u-select>
                    <el-input v-for="(cv, index) in item.conditions.values" :key="subIndex" style="width: 70px; margin-right: 5px;" v-model="cv.conVal"></el-input>
                  </div>
                </div>
                <div class="action-conf grid-col col-6">
                  <div class="text-center">
                    <span>{{item.actions.name}} {{subIndex}}</span>
                    <el-input v-for="avs in item.actions.values" :key="subIndex" style="width: 50%;" v-model="avs.avsVal"></el-input>
                  </div>
                </div>
                <div class="grid-col col-1 text-left">
                  <el-tooltip content="移除条件">
                    <i class="el-icon-fa-minus action-minus plus-anchor" @click="removeCondition(index, subIndex)"></i>
                  </el-tooltip>
                </div>
              </div>
              <div class="action-plus">
                <el-tooltip content="添加条件">
                  <i class="el-icon-fa-plus-circle plus-anchor scale2 margin-left" @click="addCondition(index)"></i>
                </el-tooltip>
                <el-tooltip content="移除组合条件块">
                  <i class="el-icon-fa-trash-o plus-anchor scale2 margin-left" @click="removeCombineCondition(index)"></i>
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
  @import "dynamic-event";
</style>

<script>
  import uSelect from '@/views/components/select/u-select'
  export default {
    name: 'dynamic-action',
    data () {
      return {
        argSelector: '',
        selectors: [{
          value: '1',
          label: '黄金糕'
        }, {
          value: '2',
          label: '双皮奶'
        }, {
          value: '3',
          label: '蚵仔煎'
        }, {
          value: '4',
          label: '龙须面'
        }, {
          value: '5',
          label: '北京烤鸭'
        }],
        argsList: [{
          status: undefined,
          name: '参数1',
          paramType: '',
          dataType: '',
          operator: '',
          values: []
        }, {
          status: undefined,
          name: '参数2',
          paramType: '',
          dataType: '',
          operator: '',
          values: []
        }, {
          status: undefined,
          name: '参数3',
          paramType: '',
          dataType: '',
          operator: '',
          values: []
        }],
        operators: [
          {
            label: '<',
            value: '<'
          },
          {
            label: '>',
            value: '>'
          },
          {
            label: '>=',
            value: '>='
          },
          {
            label: '<=',
            value: '<='
          },
          {
            label: '=',
            value: '='
          },
          {
            label: 'between',
            value: 'between'
          }
        ],
        optType: '',
        optValue: '',
        actionValue: '',
        eventsModel: {
          code: '',
          name: '',
          status: '',
          description: '',
          params: [
            {
              name: '参数1',
              status: undefined,
              paramType: '',
              dataType: '',
              operator: ''
            }
          ],
          actions: [{
            items: [
              {
                conditions: {
                  name: '条件',
                  paramType: '',
                  dataType: '',
                  operator: '',
                  values: [
                    {
                      conVal: ''
                    }
                  ]
                },
                actions: {
                  name: '操作',
                  paramType: '',
                  dataType: '',
                  operator: '',
                  values: [
                    {
                      avsVal: ''
                    }
                  ]
                }
              }
            ]
          }]
        }
      }
    },
    props: {},
    components: {uSelect},
    filters: {},
    created () {
    },
    mounted () {
    },
    methods: {
      fetchArgsList () {
        //
      },
      fetchOperators () {
        //
      },
      selectOperator (val, extra) {
        const action = this.eventsModel.actions[extra.index]
        const item = action.items[extra.subIndex]
        if (!item) return
        if (val === 'between' && item.conditions.values.length < 2) {
          item.conditions.values.push({
            conVal: ''
          })
        } else if (item.conditions.values.length >= 2) {
          item.conditions.values = [{
            conVal: ''
          }]
        }
      },
      createActionItem () {
        return {
          conditions: {
            name: '条件',
            paramType: '',
            dataType: '',
            operator: '',
            values: [
              {
                conVal: ''
              }
            ]
          },
          actions: {
            name: '操作',
            paramType: '',
            dataType: '',
            operator: '',
            values: [
              {
                avsVal: ''
              }
            ]
          }
        }
      },
      addCombineCondition () {
        this.eventsModel.actions.push({items: [this.createActionItem()]})
      },
      removeCombineCondition (index) {
        this.eventsModel.actions.splice(index, 1)
      },
      addCondition (index) {
        this.eventsModel.actions[index].items.push(this.createActionItem())
      },
      removeCondition (index, subIndex) {
        this.eventsModel.actions[index].items.splice(subIndex, 1)
      },
      createEventAction () {
        console.log(this.eventsModel)
        console.log(JSON.stringify(this.eventsModel))
      }
    }
  }
</script>
