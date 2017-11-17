<template>
  <el-switch
    v-model="model"
    :on-value="onValue"
    :off-value="offValue"
    :on-text="onText"
    :off-text="offText"
    @change="handleChange"> </el-switch>
</template>

<script>
  export default {
    name: 'multi-switch',
    data () {
      return {}
    },
    props: {
      model: undefined,
      extra: {},
      onChange: Function,
      onValue: '',
      offValue: '',
      onText: '',
      offText: ''
    },
    methods: {
      handleChange () {
        let args = [].slice.call(arguments)
        args.push(this.extra)
        this.onChange.apply(this, args)
      }
    }
  }
</script>
