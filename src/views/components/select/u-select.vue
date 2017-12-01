<template>
  <el-select placeholder="请选择" :disabled="ban" :size="size" :value="value" @input="selectOperator($event)" @visible-change="changeVisible($event)">
    <slot></slot>
  </el-select>
</template>

<style rel="stylesheet/scss" lang="scss">

</style>

<script>
export default {
  name: 'u-select',
  data () {
    return {}
  },
  props: {
    ban: false,
    value: '',
    size: '',
    extra: {},
    change: {
      type: Function,
      default: () => {}
    }
  },
  components: {},
  filters: {},
  created () {},
  mounted () {},
  methods: {
    selectOperator (val) {
      this.$emit('input', val, this.extra)
    },
    changeVisible (val) {
      this.$emit('visibleChange', val, this.extra)
    }
  }
}
</script>
