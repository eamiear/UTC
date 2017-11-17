<template>
  <div class="login-container" :style="backdrop">
    <section class="form-container">
      <h3 class="title">优托邦运营管理平台</h3>
      <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                    placeholder="密码" />
        </el-form-item>

        <el-form-item prop="verification" class="verify">
          <el-input name="verification"  @keyup.enter.native="handleLogin" v-model="loginForm.verification" autoComplete="on"
                    placeholder="验证码" />
          <span class='verify-code'><v-image :source="verifyCodeImage" /></span>
        </el-form-item>

        <el-button type="primary" style="width: 320px;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </section>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { EXCEPTION_STATUS_DESC_MAP } from '@/common/constants'

export default {
  name: 'login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
//    const validateVerification = (rule, value, callback) => {
//      // TODO
//      callback()
//    }
    /* eslint-disable no-unused-vars*/
    // TODO validate verify code
    const validateVerifyCode = (rule, value, callback) => {
      callback()
    }
    return {
      backdrop: {
        backgroundImage: 'url(' + require('@/assets/image/login/background.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        marginTop: '0'
      },
      loginForm: {
        username: '',
        password: '',
        verification: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }] // ,
//        verification: [{required: true, validator: validateVerification}]
      },
      pwdType: 'password',
      loading: false,
      verifyCodeImage: 'http://placehold.it/50x50'
    }
  },
  methods: {
    showPwd () {
      this.pwdType = this.pwdType === 'password' ? '' : 'password'
    },
    fetchVerifyCode () {
      // TODO
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then((response) => {
            this.loading = false
            if (response.code !== 0) {
              this.$notify({
                message: EXCEPTION_STATUS_DESC_MAP[response.code] || '登录失败',
                type: 'error'
              })
              this.$router.push({path: '/login'})
            } else {
              this.$router.push({ path: '/' })
            }
          }).catch((err) => {
            this.loading = false
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "login";
</style>
