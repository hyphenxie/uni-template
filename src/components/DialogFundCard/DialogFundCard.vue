<template>
  <div class="fund-wrapper"
    v-if="fundVO"
    @click="onWrapperClick">
    <div class="fund-name">{{fundVO.fund.fundName}}</div>
    <div class="fund-wrapper-row fb-row-between-end">
      <ProfitValue v-if="fundVO.showRate !== null"
        class="fund-rate"
        :value="fundVO.showRate"></ProfitValue>
      <div v-if="fundVO.showRate !== null"
        class="fund-dimension fi-1">{{fundVO.showRateDimension}}</div>
      <div class="fund-slogan"
        v-if="fundVO.showRate === null">
        {{fundVO.fund.fundSlogan}}
      </div>
      <div v-show="showBtn"
        class="fund-btn sprite-btn-fund"
        @click="fundVO.goFundDetail()">去看看</div>
    </div>
  </div>
</template>
<script>
import Fund from '@/objects/Fund'
export default {
    props: {
        fund: Object,
        showBtn: Boolean,
    },
    computed: {
        fundVO () {
            return this.fund && new Fund(this.fund)
        },
    },
    methods: {
        onWrapperClick () {
            !this.showBtn && this.fundVO.goFundDetail()
        },
    },
}
</script>
<style lang="less" scoped>
.fund-wrapper {
  position: relative;
  box-sizing: border-box;
  width: 430upx;
  height: 159upx;
  background: #fffaf4;
  border-radius: 15upx;
  padding: 26upx;
}
.fund-name {
  position: relative;
  font-size: 30upx;
  font-weight: 500;
  color: #990505;
  margin-bottom: 30upx;
  width: 350upx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &::after {
    content: ">";
    position: absolute;
    right: 2upx;
    top: 50%;
    transform: translateY(-50%);
  }
}
.fund-rate {
  font-size: 40upx;
  font-weight: 500;
  color: #ff0600;
  margin-right: 15upx;
}
.fund-dimension {
  font-size: 20upx;
  font-weight: 400;
  white-space: nowrap;
  color: rgba(153, 5, 5, 0.8);
  padding-bottom: 5upx;
  margin-right: 10upx;
  width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fund-btn {
  font-size: 22upx;
  font-weight: bold;
  color: #c80500;
  display: flex;
  align-items: center;
  padding-bottom: 4upx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 20upx;
  top: 63upx;
}

.fund-wrapper-row {
  display: flex;
  width: 100%;
}

.fund-slogan {
  font-size: 20upx;
  font-weight: 400;
  color: #990505;
  opacity: 0.8;
  align-self: flex-start;
}
</style>
