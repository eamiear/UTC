<template>
  <div class="table-picker">
    <div class="filter-container">
      <slot name="filter"></slot>
    </div>
    <el-table
      class="utable-container"
      :data="data"
      border fit highlight-current-row
      align="center"
      :height="height"
      @row-click="handleRowClick"
      style="width: 100%">
      <slot name="columns"></slot>
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
    name: 'tablePicker',
    data () {
      return {}
    },
    props: {
      data: {
        type: Array,
        default: []
      },
      height: {
        type: Number,
        default: 400
      }
    },
    components: {},
    filters: {},
    created () {},
    mounted () {},
    methods: {
      handleRowClick: function (row, event, column) {
        this.$emit('row-click', row, event, column)
      }
    }
  }
</script>
