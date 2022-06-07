<template>
  <div class="swiper-wrapper" v-if="bannerList && bannerList.length > 0">
    <swiper class="swiper-container"
      @change="onSwiperChange"
      :current="activeIndex">
      <swiper-item v-for="(item, index) in bannerList"
        :key="index">
        <view class="swiper-item"
          @click="$emit('bannerClick', item)">
          <image :src="item[type].bannerImg"
            mode="scaleToFill" />
        </view>
      </swiper-item>
    </swiper>
    <div class="swiper-dots">
      <div v-for="(item, index) in bannerList"
        :key="index"
        class="swiper-dot"
        :class="{active: index === activeIndex}"></div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        bannerList: Array, // 卡片类型，1: 我的奖品；2: 兑换商城的奖品
        type: String,
    },
    data () {
        return {
            activeIndex: 0,
        }
    },
    methods: {
        onSwiperChange (e) {
            this.activeIndex = e.detail.current
        },
    },
}
</script>
<style lang="less" scoped>
.swiper-wrapper {
  // width: 100%;
    width: 630upx;

  // height: 100%;
  display: flex;
  flex-direction: column;

  .swiper-container {
    flex: 1;
    margin-bottom: 25upx;
  }

  .swiper-dots {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .swiper-dot {
    width: 10upx;
    height: 10upx;
    background: #ffffff;
    opacity: 0.3;
    border-radius: 50%;
    margin-right: 12upx;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      opacity: 1;
    }
  }

  .swiper-item {
    width: 630upx;
    height: 190upx;
    border-radius: 20upx;
    overflow: hidden;

    image {
      display: block;
      width: 630upx;
      height: 190upx;
    }
  }
}
</style>
