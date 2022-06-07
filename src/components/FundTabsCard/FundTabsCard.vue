<template>
  <div class="fund-tabs-card flex-col cross-center" :class="[className]"
    @click="productClick">
    <div class="card-content" @click="$triggerEvent('homeMarket.onFundCardDetailClick', fundDTO)">
      <AbsDiv position="horizon-center"
        top="0"
        class="fb-row-center sprite-fund-card-title">
        <div class="company-logo"
          :style="{backgroundImage: `url(${fundDTO.fund.companyLogo})`}"></div>
        <div class="company-name">{{fundDTO.fund.companyName}}</div>
      </AbsDiv>
      <AbsDiv :bottom="24"
        :right="23"
        class="detail-btn">
        查看详情可得元宝 <div class="sprite-arrow-right"></div>
      </AbsDiv>
      <div>
        <AbsDiv class="cross-center"
          :top="fundVO.showRate === null ? 128 : 94"
          :left="20">
          <div class="fund-name">{{fundDTO.fund.fundName}}</div>
          <div class="fund-label">{{fundDTO.fund.fundLabel}}</div>
        </AbsDiv>
        <AbsDiv class="fund-slogan"
          :class="{'type-2': fundVO.showRate === null}"
          :left="20"
          :top="fundVO.showRate === null ? 184 : 135">
          {{fundDTO.fund.fundSlogan}}
        </AbsDiv>
        <AbsDiv :left="20"
          :top="180"
          v-if="fundVO.showRate !== null">
          <ProfitValue class="fund-rate"
            :value="fundVO.showRate"></ProfitValue>
        </AbsDiv>
        <AbsDiv class="fund-rank"
          :left="215"
          :top="185"
          v-if="fundVO.showRate !== null">
          {{fundDTO.fund.subNum}}
        </AbsDiv>
        <AbsDiv class="fund-dimension"
          :left="20"
          :top="224"
          v-if="fundVO.showRate !== null">
          {{fundVO.showRateDimension}}
        </AbsDiv>
      </div>
    </div>
    <!-- <div v-if="showPacket" class="packet-bubble" @click="$triggerEvent('homeMarket.onFundCardPacketClick', {fundDTO, type: cardType === 'common' ? 0 : 2})"> -->
    <div v-if="showPacket" class="packet-bubble" @click="onFundCardPacketClick">
      <AbsDiv
        :top="50"
        :right="16"
        alt="红包泡泡"
        class="sprite-click-redpacket-v4"
        ></AbsDiv>
    </div>
    <AbsDiv v-else :top="100" :right="22" class="recovery-btn" @click="goDetail">去看看</AbsDiv>
  </div>
</template>

<script>
export default {
    name: 'FundTabsCard',
    components: {},
    props: {
        fundDTO: Object, // FundCardVO
        cardType: {
            type: String,
            default () {
                return 'common' // common/dialog
            }
        }, // 1/2 两种卡片，做ABT
        className: String
    },
    data () {
        return {}
    },
    computed: {
        fundVO () {
            return this.$dto2vo('fund', this.fundDTO)
        },
        showPacket () {
            const canGainCash = this.cardType === 'advert' && this.fundDTO.fund.cashPacketId && !this.fundDTO.cashPacketStatus
            const canGainpacket = this.cardType === 'common' && this.fundDTO.fund.packetStatus && !this.fundDTO.pacaketStatus
            return canGainCash || canGainpacket
        }
    },
    methods: {
        goDetail () {
            this.fundVO.goFundDetail()
            uni.$once('pageHide', () => {
                // 2s 后 如果页面没有显示，记录次数
                let resume = false
                setTimeout(() => {
                    if (!resume) {
                        this.$http.postAddClickNum({
                            id: this.fundDTO.fund.id,
                            type: 'FUND',
                        })
                    }
                }, 2000)
                uni.$once('pageShow', () => {
                    resume = true
                })
            })
        },
        productClick () {
            this.$global.tj.report('product_click', this.card)
        },
        async onFundCardPacketClick () {
            // await this.$triggerEvent('onFundCardDetailClick', this.fundDTO)
            await this.$triggerEvent('homeMarket.onFundCardPacketClick', { fundDTO: this.fundDTO, type: this.cardType === 'common' ? 0 : 2 })
            // 无法正一次弹弹窗来更新视图，手动更新
            if (this.cardType === 'advert') this.fundDTO = { ...this.fundDTO, cashPacketStatus: 1 }
        }
    }
}
</script>
<style lang="less" scoped>
.fund-tabs-card {
  position: relative;
  width: 648upx;
  min-height: 269upx;
  border: 2upx solid #ffe9cc;
  border-radius: 20upx;
  background: linear-gradient(-90deg, #ffe9cc 0%, #fff8ef 100%);
  // margin: 0 auto;
  margin-bottom: 30upx;

  &:first-child {
    // margin-top: 30upx;
  }

  .company-logo {
    width: 39upx;
    height: 39upx;
    margin-right: 10upx;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .company-name {
    font-size: 32upx;
    font-weight: bold;
    color: #c14e10;
  }
  .detail-btn {
    font-size: 20upx;
    font-weight: 500;
    color: #a9784b;
  }
  .recovery-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180upx;
    height: 76upx;
    background: #f33244;
    border-radius: 38upx;
    font-size: 32upx;
    font-weight: 500;
    color: #ffffff;
  }

  .fund-name {
    font-size: 28upx;
    font-weight: bold;
    color: #a46c38;
    white-space: nowrap;
    margin-right: 15upx;
    max-width: 300upx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fund-label {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30upx;
    // border: 1upx solid #a46c38;
    font-size: 20upx;
    font-weight: 500;
    color: #a9784b;
    padding: 0 12upx;
    white-space: nowrap;
    position: relative;
    overflow: visible;
    &::before {
      content: '';
      position: absolute;
      width: 200%;
      height: 200%;
      left: 0;
      top: 0;
      border-radius: 5upx;
      border: 2upx solid #a46c38;
      transform: scale(.5);
      transform-origin: 0 0;
      box-sizing: border-box;
    }
  }
  .fund-rate {
    font-size: 38upx;
    font-weight: bold;
    font-family: PingFang-SC-Heavy sans-serif;
  }
  .fund-rank {
    font-size: 30upx;
    font-weight: bold;
    color: #f33244;
  }
  .fund-dimension,
  .fund-slogan {
    font-size: 22upx;
    font-weight: 500;
    color: #898989;
    max-width: 400upx;
    overflow: hidden;
    text-overflow: ellipsis;
    &.type-2 {
      font-size: 28upx;
      font-weight: 400;
      color: #b07e4e;
    }
  }
  .fund-dimension {
    margin-right: 80upx;
  }
  .recovery-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180upx;
    height: 76upx;
    background: #f33244;
    border-radius: 38upx;
    font-size: 32upx;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
