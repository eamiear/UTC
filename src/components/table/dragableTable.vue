<template>
    <div class="dragable-table">
        <u-table :tid="dtid" :data="dataList" :columns="columnsList" :height="height"></u-table>
    </div>
</template>

<script>
  // https://github.com/RubaXa/Sortable
  import Sortable from 'sortablejs'
  import uTable from './uTable.vue'

  export default {
    name: 'DragableTable',
    props: {
      dtid: String,
      columnsList: {
        type: Array,
        default: []
      },
      dataList: {
        type: Array,
        default: []
      },
      height: Number,
      start: Function,
      end: Function,
      choose: Function
    },
    components: {
      uTable
    },
    mounted () {
      const $el = document.querySelector('#' + this.dtid + ' .el-table__body-wrapper > table > tbody')
      let vm = this
      Sortable.create($el, {
        onStart: vm.start,
        onEnd: vm.end,
        onChoose: vm.choose
      })
    }
  }
</script>
