<template>
  <div class="padding">
    <h1 class="header">{{passages.title}}</h1>
    <h3 class="subHeader">{{passages.childTitle}}</h3>
    <article style="padding: 5px 0 10px;">{{passages.abstracts}}</article>
    <section class="content" v-html="passages.content"></section>
  </div>
</template>

<script>
import { fetchDetail } from '@/api/services/table/enhance'
export default {
  name: 'detail',
  data () {
    return {
      passages: {}
    }
  },
  components: {},
  created () {
    this.initList()
  },
  mounted () {},
  methods: {
    initList () {
      fetchDetail(this.$route.params.id).then(response => {
        this.passages = response.data.data
      })
    }
  }
}
</script>
