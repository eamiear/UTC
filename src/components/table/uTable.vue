<template>
    <div class="utopa-table-container">
        <div class="filter-container">
            <slot name="filter"></slot>
        </div>
        <div class="filter-container">
            <slot name="table-filter"></slot>
        </div>
        <el-table
                :ref="refs"
                :id="tid"
                :data="data"
                border fit
                highlight-current-row
                :height="height"
                @row-click="handleRowClick"
                @selection-change="handleSelectionChange"
                @cell-mouse-enter="handleCellMouseEnter"
                @cell-mouse-leave="handleCellMouseLeave"
                style="width: 100%">
            <template v-for="column in columns">
                <el-table-column
                        v-if="column.operations"
                        :prop="column.prop"
                        :label="column.label"
                        :align="column.align || 'center'"
                        :width="column.width"
                        :className="column.className"
                        :formatter="column.formatter">
                    <template slot-scope="scope">
                        <el-button v-for="(operate, key) in column.operations"
                                   :key="key" :size="operate.size || 'small'"
                                   :type="operate.type || 'danger'"
                                   @click="handleClick (operate, scope.row)">
                          <span v-if="operate.template" v-html="operate.template.call(null, scope.row)"></span>
                          <span v-else>{{operate.label}}</span>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        v-else-if="column.type"
                        :type="column.type"
                        :align="column.align || 'center'"
                        :width="column.width"
                        :className="column.className">
                </el-table-column>
                <el-table-column
                        v-else-if="column.template"
                        :label="column.label"
                        :align="column.align || 'center'"
                        :width="column.width"
                        :className="column.className"
                        :sortable="column.sortable || false"
                        :show-overflow-tooltip="column.showOverflowTooltip || false"
                        :formatter="column.formatter">
                    <template slot-scope="scope">
                        <div @click="handleClick (column.func, scope.row)" v-html="column.template.call(null, scope.row)"></div>
                    </template>
                </el-table-column>
                <el-table-column
                        v-else
                        :prop="column.prop"
                        :label="column.label"
                        :align="column.align || 'center'"
                        :width="column.width"
                        :className="column.className"
                        :sortable="column.sortable || false"
                        :show-overflow-tooltip="column.showOverflowTooltip || false"
                        :formatter="column.formatter">

                </el-table-column>
            </template>
        </el-table>
        <el-col :span="24" class="toolbar">
            <div class="toobar-action-wrapper pull-left">
                <slot name="toobar-action"></slot>
            </div>
            <div class="pagination-container">
                <slot name="pagination"></slot>
            </div>
        </el-col>

    </div>
</template>

<style rel="stylesheet/scss" lang="scss">
  .utopa-table-container {
    .toolbar {
      margin-top: 5px;
      padding: 0;
      border:none;
      .pagination-container {

      }
    }
  }
</style>

<script>
  export default {
    name: 'uTable',
    data () {
      return {
        multipleSelection: []
      }
    },
    props: {
      refs: {
        type: String,
        default: 'uTableRef'
      },
      tid: String,
      'data': {
        type: Array,
        default: []
      },
      'columns': {
        type: Array,
        default: []
      },
      height: {
        type: Number,
        default: 500
      }
    },
    components: {},
    filters: {},
    created () {},
    mounted () {},
    methods: {
      handleRowClick: function (row, event, column) {
        this.$emit('row-click', row, event, column)
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
        this.$emit('selection-change', val)
      },
      handleCellMouseEnter (row, column, cell, event) {
        this.$emit('cell-mouse-enter', row, column, cell, event)
      },
      handleCellMouseLeave (row, column, cell, event) {
        this.$emit('cell-mouse-leave', row, column, cell, event)
      },
      handleClick (operation, row) {
        if (typeof operation === 'function') {
          operation(row)
        } else if (operation) {
          operation.func && operation.func.call(null, row, operation.funcArgs || {})
        }
      }
    }
  }
</script>
