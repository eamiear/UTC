<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view" v-for="tag in Array.from(visitedViews)" :to="generateVisitedPath(tag)" :key="tag.path">
      <el-tag :closable="true" :type="isActive(tag.path)?'primary':''" @close='closeViewTabs(tag,$event)'>
        {{tag.conf.tn || tag.name}}
      </el-tag>
    </router-link>
  </div>
</template>

<script>
import assign from 'lodash.assign'
export default {
  computed: {
    visitedViews () {
      return this.$store.state.app.visitedViews.slice(-6)
    }
  },
  methods: {
    closeViewTabs (view, $event) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view.path)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
      $event.preventDefault()
    },
    generateRoute () {
      let defaultQuery = {conf: {tn: '', imt: false}}
      let query = assign({}, this.$route.query || {}, this.$route.params || {})
      if (this.$route.matched[this.$route.matched.length - 1].name) {
        let route = this.$route.matched[this.$route.matched.length - 1]
        return assign(route, {conf: query.imt ? query : defaultQuery})
      }
      this.$route.matched[0].path = '/'
      return assign(this.$route.matched[0], defaultQuery)
    },
    generateVisitedPath (tag) {
      return !tag.conf.imt ? tag.path : {path: tag.path, query: {imt: tag.conf.imt, tn: tag.conf.tn}}
    },
    addViewTabs () {
      this.$store.dispatch('addVisitedViews', this.generateRoute())
    },
    isActive (path) {
      return path === this.$route.path
    }
  },
  watch: {
    $route (to, from) {
      this.addViewTabs()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    .tabs-view {
      margin-left: 10px;
    }
  }
</style>
