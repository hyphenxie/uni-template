<template>
  <div class="award-item">
    <div class="award-item-header fb-row-between-center">
      <div class="fb-row-center">
        <image v-if="awardVO.companyLogo" class="company-logo" mode="widthFix" :src="awardVO.companyLogo"/>
        <span>{{awardVO.companyName}}</span>
      </div>
      <span>{{awardVO.createTime}}</span>
    </div>
    <div class="award-item-body fb-row-between-center">
      <div class="award-item-left">
        <div class="sprite-packet-award-img">
          <AbsDiv position="horizon-center" :top="20" class="packet-worth">{{awardVO.awardWorth}}</AbsDiv>
          <AbsDiv position="horizon-center" :top="84" class="packet-name">{{awardVO.awardNameCN}}</AbsDiv>
        </div>
      </div>
      <div class="award-item-mid flex-1">
        <!-- <div class="award-name" v-if="awardVO.isPacket">
          <span class="emphasize">{{awardVO.awardWorth}}</span>元{{awardVO.awardNameCNLong}}
        </div> -->
        <div class="award-worth">
          {{awardVO.awardWorth}}元
        </div>
        <div class="award-name">
          {{awardVO.awardNameCNLong}}
        </div>
        <div class="award-date">
          <span v-if="awardVO.expireTime && (awardVO.isConsumPacket || awardVO.isVoucherPacket)">有效期至：{{awardVO.expireTime.split(' ')[0]}}</span>
        </div>
      </div>
      <div class="award-item-right">
        <template v-if="awardVO.expried && type === '1'">
          <div class="award-button is-gray">已失效</div>
        </template>
        <template v-else>
          <div class="sprite-btn-red-sm" @click="awardVO.handleClick()" v-if="type === '1' && awardVO.awardType !== 'ALIPAY_CASH'">查看</div>
          <div class="cash-card" v-if="type === '1' && awardVO.awardType === 'ALIPAY_CASH'">发放至支付宝-余额</div>
          <div v-if="type === '2'" class="hand-card-cost">-{{awardVO.costCards}}个元宝</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Award from '@/objects/Award'
export default {
    props: {
        type: String, // 卡片类型，1: 我的奖品；2: 兑换商城的奖品
        award: Object, // awardVO
    },
    data () {
        return {}
    },
    computed: {
        awardVO () {
            return new Award(this.award)
        },
    },
}
</script>
<style lang="less" scoped>
.award-item {
  // .flex-item-fix;
  width: 688upx;
  background: #fffcf5;
  border-radius: 15upx;
  margin-bottom: 20upx;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  padding: 0 20upx;
  box-sizing: border-box;
  font-size: 36upx;
  font-weight: 500;
  color: #990505;

  &-left {
    margin-right: 20upx;
  }
  &-mid {
    flex: 1;
  }

  .packet-worth {
    font-size: 26upx;
    font-weight: bold;
    color: #e52d18;
    &::before {
      content: "¥";
      font-size: 0.9em;
    }
  }
  .packet-name {
    font-size: 20upx;
    font-weight: 500;
    color: #fdd897;
  }
  .award-name {
    font-size: 28upx;
    font-weight: 500;
    color: #990505;

    .emphasize {
      color: #990505;
      font-weight: bold;
      font-size: 36upx;
    }
  }
  .award-date {
    font-size: 24upx;
    font-weight: 400;
    color: #990505;
  }

  .cash-card {
    font-size: 20upx;
    font-weight: 400;
    color: #990505;
  }

  .hand-card-cost {
    font-size: 30upx;
    font-weight: 500;
  }
}

.award-item-header {
  border-bottom: 1upx solid rgba(153, 5, 5, 0.2);
  height: 86upx;
  font-size: 26upx;
  font-weight: 400;
  color: #990505;
}

.award-item-body {
  padding: 23upx 0;
}
.company-logo {
  width: 45upx;
  height: 45upx;
  margin-right: 15upx;
}
.award-button {
  width: 128upx;
  height: 45upx;
  background: #F1D490;
  border-radius: 23upx;
  font-size: 26upx;
  font-weight: 500;
  color: #B17C00;
  display: flex;
  align-items: center;
  justify-content: center;

  &.is-gray {
    background: #F1D490;
  }
}
.sprite-btn-red-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34upx;
  font-weight: 800;
  color: #FFFFFF;
  padding-bottom: 12upx;
}
</style>
