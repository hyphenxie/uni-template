<template>
  <div class="swiper-wrapper" v-if="viewList && viewList.length > 0">
    <swiper class="swiper-container"
      @change="onSwiperChange"
      :current="activeIndex">
      <swiper-item v-for="(item, index) in viewList"
        :key="index">
        <view class="swiper-item"
          @click="$emit('bannerClick', item)">
          <image :src="item.imrUrl"
            mode="scaleToFill" />
        </view>
      </swiper-item>
    </swiper>
    <div class="swiper-dots">
      <div v-for="(item, index) in viewList"
        :key="index"
        class="swiper-dot"
        :class="{active: index === activeIndex}"></div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        viewList: {
            type: Array,
            default: () => [
                { imrUrl: 'http://120.197.235.102/jssdk/jssdk_digit/img/icon-loading.png', link: '123' },
                { imrUrl: 'http://120.197.235.102/jssdk/jssdk_digit/img/icon-close.png', link: '123' },
            ],
        },
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
    width: 630upx;
    height: 500upx;
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
    background: red;
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
