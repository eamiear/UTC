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
      style="width: 100%">
      <template v-for="column in columns">
        <el-table-column
          v-if="column.operations"
          :prop="column.prop"
          :label="column.label"
          :align="column.align || 'center'"
          :width="column.width"
          :style="column.style"
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
          v-else
          :prop="column.prop"
          :label="column.label"
          :align="column.align || 'center'"
          :width="column.width"
          :style="column.style"
          @click="handleClick (operate, scope.row)"
          :formatter="column.formatter">
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
      return {}
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
      handleClick (operation, row) {
        if (operation) {
          operation.func && operation.func.call(null, row, operation.funcArgs || {})
        }
      }
    }
  }
</script>
