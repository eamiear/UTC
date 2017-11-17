<template>
  <div class="spicy-created-wrapper">
    <el-form class="form-container" autoComplete="on" :model="spicyForm" :rules="rules" ref="spicyForm" label-width="80px">
      <el-row>
        <el-col :span="14">
          <el-form-item style="margin-bottom: 30px;" label="标题" prop="title">
            <el-input type="input" placeholder="标题" v-model="spicyForm.title"></el-input>
            <span v-show="spicyForm.title.length>=26" class='title-prompt'>标题过长，app可能会显示不全</span>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item style="margin-bottom: 30px;" label="子标题">
            <el-input type="input" placeholder="子标题" v-model="spicyForm.childTitle"></el-input>
            <span v-show="spicyForm.childTitle.length>=26" class='title-prompt'>子标题过长，app可能会显示不全</span>
          </el-form-item>
        </el-col>

        <el-col :span="14">
          <el-row style="margin-bottom: 10px;">
            <el-col :span="8">
              <el-form-item label="主题" class="postInfo-container-item" prop="tagId">
                <el-select clearable class="filter-item" placeholder="选择主题" v-model="spicyForm.tagId" @visible-change="fetchThemeList">
                  <el-option v-for="item in themes" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期数" class="postInfo-container-item" prop="periods">
                <el-input type="input" placeholder="一" v-model="spicyForm.periods"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="商场" class="postInfo-container-item" prop="mallId">
                <el-select clearable class="filter-item" placeholder="选择商场" v-model="spicyForm.mallId" @visible-change="fetchMallList">
                  <el-option v-for="item in malls" :key="item.id" :label="item.shortname" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item style="margin-bottom: 30px;" label="封面" prop="coverImage">
            <Upload v-model="spicyForm.coverImage"></Upload>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item style="margin-bottom: 10px;" label="摘要">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入摘要信息" v-model="spicyForm.abstracts"></el-input>
            <span class="word-counter" v-show="abstractCount">{{abstractCount}}/120字</span>
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item label="详情内容" style="margin-bottom: 40px">
            <tinymce :height=400 ref="editor" v-model="spicyForm.content"></tinymce>
          </el-form-item>
        </el-col>
        <el-col :span="14" style="text-align: left; margin-left: 80px; margin-bottom: 20px;">
          <el-button type="primary" @click.native.prevent="handleSubmit">发布</el-button>
          <router-link :to="{path: '/service/table/enhance'}">
            <el-button type="default" style="margin-right: 10px;">
              取消
            </el-button>
          </router-link>

        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage3'
  import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'
  import { error } from '@/utils/dialog'
  import { Utopa } from '@/common/utopa'
  import * as SpicyLeader from '@/api/merchants/spicyleader'
  import * as themeService from '@/api/merchants/theme'
  import {fetchMallsList} from '@/api/malls'

  export default {
    name: 'articleDetail',
    components: { Tinymce, Upload },
    data () {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          callback(rule.field + '为必传项')
        } else {
          callback()
        }
      }
      return {
        spicyForm: {
          title: '',
          childTitle: '',
          tagId: undefined,
          mallId: undefined,
          periods: '',
          content: '',
          abstracts: '',
          coverImage: '',
          imageKey: '',
          id: undefined
        },
        themes: [],
        malls: [],
        abstractTotal: 120,
        fetchSuccess: true,
        loading: false,
        rules: {
          title: [{ require: true, validator: validateRequire, message: '请输入标题' }],
          periods: [{ require: true, validator: validateRequire, message: '请填写期数' }],
          mallId: [{ require: true, validator: validateRequire, message: '请选择商场', trigger: 'change' }],
          coverImage: [{ require: true, validator: validateRequire, message: '请上传封面', tigger: 'change' }]
        }
      }
    },
    computed: {
      abstractCount () { // 摘要字数
        return this.spicyForm.abstracts ? this.spicyForm.abstracts.length : 0
      },
      isEdit () { // 编辑状态
        return this.$route.query.isEdit
      },
      magazineId () {
        return this.$route.query.id
      }
    },
    created () {
      if (this.isEdit) {
        this.fetchThemeList()
        this.fetchMallList()
        this.fetchData()
      }
    },
    watch: {
      'spicyForm.abstracts': function (val) {
        if (!this.spicyForm.abstracts) return
        if (this.abstractCount >= this.abstractTotal) {
          this.$nextTick(() => { this.spicyForm.abstracts = val.slice(0, this.abstractTotal) })
        }
      },
      'spicyForm.coverImage': function (val) {
        this.spicyForm.imageKey = val.slice(val.lastIndexOf('/') + 1)
      }
    },
    methods: {
      fetchData () {
        SpicyLeader.fetchSpicyLeaderById(this.magazineId).then(response => {
          if (Utopa.isValidRequest(response)) {
            this.spicyForm = response.data.data
          }
        }).catch(err => {
          console.log(err)
        })
      },
      fetchThemeList () {
        if (!this.themes.length) {
          themeService.fetchThemeList().then((response) => {
            const result = response.data
            if (Utopa.isValidRequest(response)) {
              this.themes = result.data.infos || []
            }
          })
        }
      },
      fetchMallList () {
        if (!this.malls.length) {
          fetchMallsList().then(response => {
            const result = response.data
            if (Utopa.isValidRequest(response)) {
              this.malls = result.data.allMallBrief || []
            }
          })
        }
      },
      handleSubmit () {
        const _this = this
        _this.$refs.spicyForm.validate(valid => {
          if (valid) {
            SpicyLeader.createSpicyLeader(_this.spicyForm).then((response) => {
              const result = response.data
              if (Utopa.isValidRequest(response)) {
                _this.$router.push({path: '/service/table/enhance'})
              } else {
                error(result.msg || EXCEPTION_STATUS_DESC_MAP[result.code] || '新增失败')
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .spicy-created-wrapper{
    padding:15px 10px;
    .word-counter{
      font-size: 12px;
      color: #999;
      position: absolute;
      right: 0;
      bottom: -33px;
    }
    .editor-container{
      margin: 0 80px 10px;
    }
  }
</style>

