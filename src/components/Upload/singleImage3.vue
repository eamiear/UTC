<template>
	<div class="upload-container">
		<el-upload class="image-uploader"
               :data="data" drag
               :multiple="false"
               :show-file-list="false"
               :action="action"
               accept="image/*"
		  :on-success="handleImageScucess"
      :before-upload="beforeUpload">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过{{fileSize}}</div>
		</el-upload>
		<div class="image-preview image-app-preview">
			<div class="image-preview-wrapper" v-show="imageUrl.length>1">
				<div class='app-fake-conver'></div>
				<img :src="imageUrl">
				<div class="image-preview-action">
					<i @click="removeImage" class="el-icon-delete"></i>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getQiNiuToken } from '@/api/common/qiniu'
// import { QINIU_IMAGE_REQUEST_BASEURL, QINIU_UPLOAD_URL } from '@/common/constants'
import { QINIU_UPLOAD_URL } from '@/common/constants'

export default {
  name: 'singleImageUpload',
  props: {
    value: String,
    accept: String,
    fileSize: {
      type: String,
      default: '500KB'
    },
    fileType: String
  },
  computed: {
    imageUrl () {
      return this.value
    }
  },
  data () {
    return {
      action: QINIU_UPLOAD_URL,
      data: { token: '' }
    }
  },
  methods: {
    removeImage () {
      this.emitInput('')
    },
    emitInput (val) {
      this.$emit('input', val)
    },
    handleImageScucess (response, file) {
//      this.emitInput(QINIU_IMAGE_REQUEST_BASEURL + response.key)
      this.emitInput(file.url)
    },
    validateFileSize (bytes) {
    },
    validateFileType (fileType) {
    },
    beforeUpload (file) {
      const _this = this
      return new Promise((resolve, reject) => {
        getQiNiuToken().then(response => {
          _this.data.token = response.data.data.upToken
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
	width: 100%;
	position: relative;
	.image-uploader {
		float: left;
	}
	.image-preview {
		width: 200px;
		height: 200px;
		position: relative;
		border: 1px dashed #d9d9d9;
		float: left;
		margin-left: 50px;
		.image-preview-wrapper {
			position: relative;
			width: 100%;
			height: 100%;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.image-preview-action {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			cursor: default;
			text-align: center;
			color: #fff;
			opacity: 0;
			font-size: 20px;
			background-color: rgba(0, 0, 0, .5);
			transition: opacity .3s;
			cursor: pointer;
			text-align: center;
			line-height: 200px;
			.el-icon-delete {
				font-size: 36px;
			}
		}
		&:hover {
			.image-preview-action {
				opacity: 1;
			}
		}
	}
	.image-app-preview {
		width: 320px;
		height: 180px;
		position: relative;
		border: 1px dashed #d9d9d9;
		float: left;
		margin-left: 50px;
		.app-fake-conver {
			height: 44px;
			position: absolute;
			width: 100%; // background: rgba(0, 0, 0, .1);
			text-align: center;
			line-height: 64px;
			color: #fff;
		}
	}
}
</style>
