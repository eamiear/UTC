<template>
    <div class="utopa-table-container">
        <div class="filter-container">
            <slot name="filter"></slot>
        </div>
        <div class="filter-container">
            <slot name="table-filter"></slot>
        </div>
        <el-table
                :data="data"
                border fit
                highlight-current-row
                :height="height"
                @row-click="handleRowClick"
                @selection-change="handleSelectionChange"
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
                            {{operate.label}}
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
                        :formatter="column.formatter"
                        @click="handleClick (operate, scope.row)">
                    <template slot-scope="scope">
                        <div v-html="column.template.call(null, scope.row)"></div>
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
                        :formatter="column.formatter"
                        @click="handleClick (operate, scope.row)">

                </el-table-column>
            </template>
        </el-table>
        <div class="pagination-container">
            <slot name="pagination"></slot>
        </div>
    </div>
</template>

<style rel="stylesheet/scss" lang="scss">

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
        this.$emit('table-selection', val)
      },
      handleClick (operation, row) {
        if (operation) {
          operation.func && operation.func.call(null, row, operation.funcArgs || {})
        }
      }
    }
  }
</script>
