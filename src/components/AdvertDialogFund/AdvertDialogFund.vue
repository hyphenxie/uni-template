<template>
  <div class="fund-tabs-card flex-col cross-center"
    :class="[className]"
    @click="productClick">
    <div class="card-content"
      @click="$triggerEvent('homeMarket.onFundCardDetailClick', fundDTO)">
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
          :top="fundVO.showRate === null ? 98 : 64"
          :left="13">
          <div class="fund-name">{{fundDTO.fund.fundName}}</div>
          <div class="fund-label">{{fundDTO.fund.fundLabel}}</div>
        </AbsDiv>
        <AbsDiv class="fund-slogan"
          :class="{'type-2': fundVO.showRate === null}"
          :left="13"
          :top="fundVO.showRate === null ? 154 : 105">
          {{fundDTO.fund.fundSlogan}}
        </AbsDiv>
        <AbsDiv :left="13"
          :top="137"
          v-if="fundVO.showRate !== null">
          <ProfitValue class="fund-rate"
            :value="fundVO.showRate"></ProfitValue>
        </AbsDiv>
        <AbsDiv class="fund-dimension"
          :left="13"
          :top="170"
          v-if="fundVO.showRate !== null">
          {{fundVO.showRateDimension}}
        </AbsDiv>
        <AbsDiv class="fund-rank"
          :left="13"
          :top="197"
          v-if="fundVO.showRate !== null">
          {{fundDTO.fund.subNum}}
        </AbsDiv>

      </div>
    </div>
    <div v-if="showPacket"
      class="packet-bubble"
      @click="onFundCardPacketClick">
      <AbsDiv :top="50"
        :right="10"
        alt="红包泡泡"
        class="sprite-click-redpacket-v4"></AbsDiv>
    </div>
    <AbsDiv v-else
      :top="130"
      :right="22"
      class="recovery-btn"
      @click="goDetail">去看看</AbsDiv>
  </div>
</template>

<script>
export default {
    name: 'AdvertDialogFund',
    components: {},
    props: {
        defaultFundDTO: Object, // FundCardVO
        cardType: {
            type: String,
            default () {
                return 'common' // common/dialog
            },
        }, // 1/2 两种卡片，做ABT
        className: String,
    },
    data () {
        return {
            fundDTO: {}
        }
    },
    computed: {
        fundVO () {
            return this.$dto2vo('fund', this.fundDTO)
        },
        showPacket () {
            const canGainCash =
        this.cardType === 'advert' &&
        this.fundDTO.fund.cashPacketId &&
        !this.fundDTO.cashPacketStatus
            const canGainpacket =
        this.cardType === 'common' &&
        this.fundDTO.fund.packetStatus &&
        !this.fundDTO.pacaketStatus
            return canGainCash || canGainpacket
        },
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
            await this.$triggerEvent('homeMarket.onFundCardPacketClick', {
                fundDTO: this.fundDTO,
                type: this.cardType === 'common' ? 0 : 2,
            })
            // 无法正一次弹弹窗来更新视图，手动更新
            setTimeout(() => {
                if (this.cardType === 'advert') { this.fundDTO = { ...this.fundDTO, cashPacketStatus: 1 } }
            }, 1000)
            console.log('cardType', this.cardType, this.fundDTO)
        },
    },
    created () {
        this.fundDTO = this.defaultFundDTO
    }
}
</script>
<style lang="less" scoped>
.fund-tabs-card {
  position: relative;
  width: 436upx;
  height: 234upx !important;
  border: 2upx solid #ffe9cc;
  border-radius: 20upx;
  background: linear-gradient(-90deg, #ffe9cc 0%, #fff8ef 100%);
  margin-bottom: 30upx;
  .sprite-fund-card-title {
    transform: translateX(-50%) scale(41.5/59);
    transform-origin: center top;
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
    font-size: 15upx;
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
    width: 84upx;
    height: 40upx;
    background: #f33244;
    border-radius: 20upx;
    font-size: 16upx;
    font-weight: 500;
    color: #ffffff;
  }

  .fund-name {
    font-size: 22upx;
    font-weight: bold;
    color: #a46c38;
    white-space: nowrap;
    margin-right: 15upx;
    max-width: 320upx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fund-label {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20upx;
    // border: 1upx solid #a46c38;
    font-size: 14upx;
    font-weight: 500;
    color: #a9784b;
    padding: 0 8upx;
    white-space: nowrap;
    position: relative;
    overflow: visible;
    &::before {
      content: "";
      position: absolute;
      width: 200%;
      height: 200%;
      left: 0;
      top: 0;
      border-radius: 5upx;
      border: 2upx solid #a46c38;
      transform: scale(0.5);
      transform-origin: 0 0;
      box-sizing: border-box;
    }
  }
  .fund-rate {
    font-size: 26upx;
    font-weight: bold;
    font-family: PingFang-SC-Heavy sans-serif;
  }
  .fund-rank {
    font-size: 20upx;
    font-weight: bold;
    color: #f33244;
  }
  .fund-dimension,
  .fund-slogan {
    font-size: 18upx;
    font-weight: 500;
    color: #898989;
    max-width: 300upx;
    overflow: hidden;
    text-overflow: ellipsis;
    &.type-2 {
      font-size: 28upx;
      font-weight: 400;
      color: #b07e4e;
    }
  }
  .fund-dimension {
    font-size: 16upx;
    margin-right: 80upx;
  }
  .sprite-click-redpacket-v4 {
    transform: scale(0.7);
    transform-origin: right top;
  }
}
</style>
