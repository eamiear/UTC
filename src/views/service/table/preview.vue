<template>
  <div class="spicy-preview-wrapper">
    <router-link :to="{path: '/service/table/addRecord', query: { isEdit: true, id: magazineId }}">
      <button type="button" class="page-edit btn btn-light-blue"><icon name="edit"></icon></button>
    </router-link>

    <div class="page">
      <p class="periods"><span>第{{contentModel.periods}}期</span></p>
      <div class="content" v-html="contentModel.content"></div>
      <div class="vote">
        <h3 class="vote-label">投票</h3>
        <p class="vote-desc">{{voteModel.title}}</p>
        <ul class="vote-list">
          <li class="vote-list-item" v-for="voteItem in voteModel.voteItemList">
            <div class="v-avatar">
              <div class="v-avatar-wrapper"  v-show="voteItem.image">
                <img :src="voteItem.image">
              </div>
            </div>
            <div class="vote-list-item-detail">
              <div class="vote-list-item-detail-desc">{{voteItem.title}}</div>
              <el-progress :text-inside="false" :show-text="true" :stroke-width="12" :percentage="voteItem.votes | progressFilter" ></el-progress>
            </div>
          </li>
        </ul>
      </div>
      <div class="comments">
        <div class="comments-title">精选评论（{{commentsTotal}}）</div>
        <ul class="comments-list">
          <li class="comments-list-item"  v-for="comment in commentsModel">
            <div class="v-avatar">
              <div class="v-avatar-wrapper" v-show="comment.image">
                <img :src="comment.image">
              </div>
            </div>
            <div class="comments-detail">
              <div class="comments-detail-header">
                <p class="nickname">{{comment.nickName}}</p>
                <span class="datetime">{{comment.createTime | dateFormat}}</span>
              </div>
              <p class="comments-detail-desc">{{comment.content}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import * as SpicyLeader from '@/api/merchants/spicyleader'
  import { fetchCriticalComments } from '@/api/system/comments'
  export default {
    name: 'u-preview',
    data () {
      return {
        contentModel: {
          content: ''
        },
        voteModel: {},
        commentsTotal: 0,
        commentsModel: []
      }
    },
    props: {
      magazineId: Number,
      voteId: Number
    },
    created () {
      this.initPage()
    },
    filters: {
      progressFilter (val) {
        return !val ? 0 : val > 100 ? 100 : val
      }
    },
    methods: {
      initPage () {
        this.getMagazine()
        this.getVotes()
        this.getComments()
      },
      getMagazine () {
        SpicyLeader.fetchSpicyLeaderById(this.magazineId).then(response => {
          this.contentModel = response.data.data
        })
      },
      getVotes () {
        SpicyLeader.fetchVotesByMagazineId(this.magazineId).then(response => {
          this.voteModel = response.data.data || {}
        })
      },
      getComments () {
        fetchCriticalComments(this.magazineId).then(response => {
          this.commentsModel = response.data.data.infos || []
          this.commentsTotal = response.data.data.total
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  ul{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .el-dialog--full{
    background: rgba(0, 0, 0, 0.9);
    .el-dialog__title{
      color: #b3b2b2;
    }
  }
  .spicy-preview-wrapper,
  .spicy-preview-wrapper .page{
    border-radius: 7px;
  }
  .spicy-preview-wrapper {
    margin: 0 auto;
    width: 375px;
    height: 667px;
    position: relative;
    background-color: #ccc;
    box-shadow: 0 0 8px 0 rgba(0,0,0,.3);
    z-index: 156;
    font-family: 'microsoft yahei';

    .page-edit{
      position: absolute;
      top: 0;
      left: 100%;
      margin-left: 10px;
      color: #fff;
    }
    .page {
      width: 375px;
      padding: 10px;
      position: relative;
      margin: auto;
      height: 100%;
      background: #fff;
      overflow-y: auto;
    }
    .page .periods{
      text-align: right;
      padding: 5px;
      font-size: 13px;
      color: #999;
      margin-bottom: 0;
    }
    .page .content{
      padding: 5px 0;

      img {
        max-width:100%;
      }
    }
    .vote {
      background: #F6F6F6;
      border:1px solid #FAFAFA;
      padding: 10px 12px;

      .vote-label{
        font-size: 14px;
        color: #FB8A75;
        text-align: center;
        margin: 15px 0;
        padding-bottom: 15px;
        border-bottom: 1px solid #c5c5c5;
      }
      .vote-desc{
        font-size: 13px;
      }
    }
    .v-avatar{
      display: inline-block;
      float: left;
      width: 40px;
      height: 40px;
      border: 1px double #999;
      margin: 0;
      border-radius: 50%;
      overflow: hidden;
    }
    .v-avatar-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
    .vote-list {
      padding: 10px 0;
      .vote-list-item{
        margin-bottom: 20px;
      }
      .vote-list-item-detail {
        padding-left: 55px;

        .vote-list-item-detail-desc {
          font-size: 12px;
          margin-bottom: 4px;
        }
      }
      .el-progress__text{
        font-size: 14px!important;
        color: #999;
      }
    }
    .comments{
      margin-top: 20px;
      padding: 10px 12px;
      .comments-title{
        color: #999;
        font-size: 12px;
        padding:0 0 10px;
        border-bottom: 1px solid #eee;
      }
      .comments-list{
        .comments-list-item{
          padding: 10px 0 20px;
          margin-bottom: 5px;
          border-bottom: 1px solid #eee;
        }
        .comments-detail{
          padding-left: 55px;
        }
        .comments-detail .comments-detail-header{
          overflow: hidden;
          font-size: 12px;
          color: #bbb;
          margin-top: 5px;
        }
        .comments-detail-header .nickname{
          float: left;
          font-size: 14px;
          color: #333;
          margin-bottom: 0;
        }
        .comments-detail-header .datetime{
          float: right;
        }
        .comments-detail-desc{
          font-size: 12px;
          color: #777;
        }
      }
    }
  }
</style>
