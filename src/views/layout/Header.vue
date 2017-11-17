<template>
  <header class="main-header">
    <!-- Logo -->
    <a href="#" class="logo">
      <span class="logo-image"><img :src="utopaLogo" alt="utopa"></span>
      <span class="logo-lg" style="text-align: left;">UTC组件平台</span>
    </a>
    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top">
      <!-- Sidebar toggle button-->
      <toggle class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></toggle>

      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!-- User Account: style can be found in dropdown.less -->
          <li class="user user-menu">
            <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
              <img v-if="avatar" :src="avatar" class="user-image" alt="User Image">
              <span class="hidden-xs">{{name}}</span>
            </a>
            <ul class="dropdown-menu">
              <!-- User image -->
              <li class="user-header">
                <img :src="avatar" class="img-circle" alt="potrait">

                <p>
                  {{name}}<br>
                  <span style="font-size:12px; color: rgb(210, 209, 209); text-align: left; display: block;">简介</span>
                  <small style="font-size: 12px; padding: 3px;">{{introduction}}</small>
                </p>
              </li>
              <!-- Menu Body -->
              <!--<li class="user-body">-->
              <!--</li>-->
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="pull-left">
                  <router-link class='inlineBlock' to="/">
                    <span class="btn btn-default btn-flat">首页</span>
                  </router-link>

                </div>
                <div class="pull-right">
                  <span @click="logout" class="btn btn-default btn-flat">退出登录</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Toggle from '@/components/Toggle'
  import { slimScroll } from '@/utils/plug'
  import logo from '@/assets/image/logo.png'

  export default {
    components: {
      Toggle
    },
    data () {
      return {
        openUserMenu: false,
        utopaLogo: logo
      }
    },
    props: {
      slimscroll: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'introduction'
      ])
    },
    mounted () {
      if (this.slimscroll) {
        slimScroll('.navbar .menu', {
          height: '200px'
        })
      } else {
        let menu = document.querySelector('.navbar .menu')
        if (menu) {
          menu.style.overflowY = 'auto'
        }
      }
    },
    methods: {
      toggleSideBar () {
        this.$store.dispatch('ToggleSideBar')
      },
      logout () {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      }
    }
  }
</script>
