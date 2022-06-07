<template>
  <div class="load-page"
    :disable-scroll="true"
    v-if="!finished">
    <!-- 加载gif图 -->
    <div class="loading-icon-wrapper">
      <div class="loading-icon"></div>
      <div class="loading-icon-shadow"></div>
    </div>
    <!-- 加载进度条 -->
    <div class="progress-box">
      <div class="progress-line"
        :style="processStyle"></div>
    </div>
    <div class="load-desc">
      {{loadingProcess || 0}}% 加载中~
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        loaded: Boolean,
        delay: {
            type: Number,
            default () {
                return 200
            },
        },
    },
    data () {
        return {
            loadingProcess: 0,
            targetProcess: 0,
            finished: false,
            duration: 600,
        }
    },
    computed: {
        processStyle () {
            return {
                transition: `width ${this.duration / 1000}s linear`,
                width: this.targetProcess + '%',
            }
        },
    },
    methods: {
        watchLoaded () {
            const unwatchLoaded = this.$watch('loaded', (val) => {
                if (val) {
                    unwatchLoaded()
                    if (this.targetProcess === this.loadingProcess) {
                        this.goto(100, 300)
                    } else {
                        const unwatch = this.$watch('loadingProcess', () => {
                            if (this.targetProcess === this.loadingProcess) {
                                this.goto(100, 300)
                                unwatch()
                            }
                        })
                    }
                }
            })
        },
        watchLoading () {
            const unwatch = this.$watch('loadingProcess', (val) => {
                if (val >= 100) {
                    unwatch()
                    setTimeout(() => {
                        this.finished = true
                    }, this.delay + this.duration)
                }
            })
        },
        goto (percent, duration = 1000) {
            this.duration = duration
            percent = Math.min(Math.max(0, percent), 100)
            const fps = 80
            const dis = percent - this.targetProcess
            this.targetProcess = percent
            const step = Math.max(Math.floor(dis / Math.ceil(duration / fps)), 1) // 最小取1，避免向下取整后step为0
            const timer = setInterval(() => {
                if (this.loadingProcess >= percent) return clearInterval(timer)
                this.loadingProcess = Math.min(this.loadingProcess + step, percent)
            }, fps)
        },
    },
    mounted () {
        const defaultRandomProgress = Math.floor(Math.random() * 100 * 0.2 + 79)
        this.goto(defaultRandomProgress, 600)
        this.watchLoaded()
        this.watchLoading()
    },
}
</script>

<style lang="less" scoped>
@color: #666666; // 字体颜色
@progress-bar-default: #FFDED7; // 进度条底色
@progress-bar-border: #D72524; // 进度条边框色
@progress-bar: linear-gradient(90deg, #FA5259 0%, #C60A10 100%);; // 进度条渐变色
@shadow-color: rgba(190, 109, 21, .25); // 阴影颜色
@duration: .6s; // 浮动动效时长
@shadow-width: 119upx; // 阴影时长
@loading-icon-img: "~images/common/loading-icon.png"; // icon
@loading-icon-star: "~images/common/loading-star.png"; // icon旁边的装饰（会闪—）
.load-page {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10001;
  width: 100vw;
  height: 100vh;
  background: #FDF1DC;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding-bottom: 300upx;
  .progress-box {
    width: 530upx;
    height: 27upx;
    box-sizing: border-box;
    background: @progress-bar-default;
    border: 2upx solid @progress-bar-border;
    border-radius: 13upx;
    margin: 20upx auto;
    margin-top: 40upx;
    .progress-line {
      height: 100%;

      background: @progress-bar;
      border-radius: 13upx;
      width: 0;
    }
  }
  .load-desc {
    font-size: 31upx;
    font-weight: 400;
    color: @color;
    line-height: 41upx;
  }

  .loading-icon-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    &::before {
        content: '';
        position: absolute;
        left: -30upx;
        top: 50upx;
        width: 23upx;
        height: 24upx;
        animation: loading-icon-desc 1s linear infinite alternate-reverse;
        background-image: url(@loading-icon-star);
        background-size: 100% auto;
        background-repeat: no-repeat;
    }
    &::after {
        content: '';
        position: absolute;
        right: -30upx;
        top: 0upx;
        width: 23upx;
        height: 24upx;
        animation: loading-icon-desc 1.2s linear infinite alternate-reverse;
        background-image: url(@loading-icon-star);
        background-size: 100% auto;
        background-repeat: no-repeat;
    }

    @keyframes loading-icon-desc {
        from {
            opacity: 0.1;
        }
        to {
            opacity: 1;
        }
    }
  }
  .loading-icon {
    width: 127upx;
    height: 77upx;
    background-image: url(@loading-icon-img);
    background-repeat: no-repeat;
    background-size: 100%;
    animation: loading-coin @duration linear infinite alternate-reverse;
    position: relative;
    z-index: 2;
    @keyframes loading-coin {
      from {
        transform: translateY(10upx);
      }
      50% {
        transform: translateY(0upx);
      }
      to {
        transform: translateY(-10upx);
      }
    }
  }
  .loading-icon-shadow {
    width: @shadow-width;
    height: @shadow-width / 5;
    border-radius: 50%;
    background-color: @shadow-color;
    animation: oval-shadow @duration linear infinite alternate-reverse;
    @keyframes oval-shadow {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(0.5);
        opacity: 0.5;
      }
    }
  }
}
</style>
