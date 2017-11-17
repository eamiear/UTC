<template>
  <el-upload class="vote-avatar-uploader"
             :data="postData"
             :multiple="false"
             :show-file-list="false"
             :action="requestUrl"
             accept="accept"
             :on-success="handleSuccess"
             :on-remove="handleRemove"
             :before-upload="onBeforeUpload">
    <slot></slot>
    <el-button size="small">{{uploadText}}</el-button>
  </el-upload>
</template>

<style rel="stylesheet/scss" lang="scss">

</style>

<script>
  export default {
    name: 'multi-upload',
    data () {
      return {}
    },
    props: {
      extra: {},
      postData: Object,
      requestUrl: String,
      onSuccess: Function,
      onRemove: Function,
      onBeforeUpload: Function,
      accept: {
        type: String,
        default: '.jpg, .png, .svg, .jpeg, .jpeg2000, .bmg'
      },
      uploadText: {
        type: String,
        default: '点击上传'
      }
    },
    methods: {
      handleSuccess () {
        let args = [].slice.call(arguments)
        args.push(this.extra)
        this.onSuccess.apply(this, args)
      },
      handleRemove () {
        let args = [].slice.call(arguments)
        args.push(this.extra)
        this.onRemove.apply(this, args)
      },
      handleBeforeUpload () {
        // let args = [].slice.call(arguments)
       // this.onBeforeUpload.apply(this, args)
      }
    }
  }
</script>
