<template>
  <div>
    <el-row>
      <el-col :span="16">
        <el-card>
          <DragableTable dtid="dragTable" :columnsList="columnsList" :dataList="tableData" :start="onDragStart"
                         :end="onDragEnd"></DragableTable>
        </el-card>
      </el-col>
      <el-col :span="8" class="padding-left">
        <el-card>
          <p slot="header">
            <i class="el-icon-fa-clipboard"></i>
            拖拽操作记录
          </p>
          <el-row>
            <div class="dragging-tip-con">
              <transition name="dragging-tip">
                <span v-show="tableProps.isDragging">正在拖拽表格单元行...</span>
              </transition>
            </div>
            <el-card>
              <div class="record-tip-con">
                <div v-for="(item, index) in tableProps.draggingRecord" :key="index" class="record-item">
                  拖拽第 {{ item.from }} 行表格到第 {{ item.to }} 行
                </div>
              </div>
            </el-card>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss">
  .dragging-tip-con {
    display: block;
    text-align: center;
    width: 100%;
    height: 50px;
  }
  .record-tip-con {
    display: block;
    width: 100%;
    height: 292px;
    overflow: auto;

    .record-item {
      box-sizing: content-box;
      display: block;
      overflow: hidden;
      height: 24px;
      line-height: 24px;
      padding: 8px 10px;
      border-bottom: 1px dashed #dcdcdc;
    }
  }

</style>

<script>
import DragableTable from '@/components/table/dragableTable'
import { fetchMallsList } from '@/api/malls'
import { Utopa } from '@/common/utopa'
import { error } from '@/utils/dialog'

export default {
  name: 'dragable-table',
  data () {
    return {
      tableData: [],
      columnsList: [
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
        },
        {
          label: '拖拽',
          operations: [
            {
              type: 'text',
              template: function (row) {
                return '<i class="el-icon-fa-arrows"></i>'
              }
            }
          ]
        }
      ],
      tableProps: {
        hasDragged: false,
        isDragging: false,
        oldIndex: 0,
        newIndex: 0,
        draggingRecord: []
      }
    }
  },
  props: {},
  components: {
    DragableTable
  },
  filters: {},
  created () {
    this.getTableData()
  },
  mounted () {},
  methods: {
    getTableData () {
      fetchMallsList().then(response => {
        const result = response.data
        if (Utopa.isValidRequest(response)) {
          this.tableData = result.data.infos
        } else {
          error('获取失败')
        }
      })
    },
    onDragStart (el) {
      this.tableProps.oldIndex = el.oldIndex
      this.tableProps.hasDragged = true
      this.tableProps.isDragging = true
    },
    onDragEnd (el) {
      this.tableProps.newIndex = el.newIndex
      this.tableProps.isDragging = false
      this.tableProps.draggingRecord.unshift({
        from: this.tableProps.oldIndex + 1,
        to: this.tableProps.newIndex + 1
      })
    }
  }
}
</script>
