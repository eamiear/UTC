<template>
  <div class="dashboard-container">
    <div class="plates-group column pane">
      <div class="plate col-md-3">
        <div class="content">
          <div class="statistic">
            <div class="value">1520</div>
            <div class="label">今日销售总额</div>
            <div class="label">历史月均:<span class="num">234</span> </div>
          </div>
        </div>
      </div>
      <div class="plate col-md-3">
        <div class="content">
          <div class="statistic">
            <div class="value">550</div>
            <div class="label">今日订单数 </div>
            <div class="label">历史月均:<span class="num">234</span> </div>
          </div>
        </div>
      </div>
      <div class="plate col-md-3">
        <div class="content">
          <div class="statistic">
            <div class="value">550</div>
            <div class="label">今日注册会员 </div>
            <div class="label">历史月均:<span class="num">234</span> </div>
          </div>
        </div>
      </div>
      <div class="plate col-md-3">
        <div class="content">
          <div class="statistic">
            <div class="value">550</div>
            <div class="label">今日入驻店铺数 </div>
            <div class="label">历史月均:<span class="num">234</span> </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-wrapper">
      <div class="plate">
        <h3 class="header">订单来源统计</h3>
        <div class="content">
          Calendar
        </div>
      </div>
      <div class="plate">
        <h3 class="header">订单排行统计</h3>
        <div class="content">
          Calendar
        </div>
      </div>
      <div class="plate">
        <h3 class="header">销售额统计</h3>
        <div class="content">
          Calendar
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .chart-wrapper{
    .plate{
      margin: 10px 0;
    }
  }
</style>

<script>

export default {

}
</script>
