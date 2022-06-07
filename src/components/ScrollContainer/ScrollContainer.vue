<template>
	<view class="scroll" :style="scrollStyle">
        <!-- scroll容器 -->
		<scroll-view
            @scroll="contentScroll"
            class="scroll-wrapper"
            :class="isIOS ? 'is-ios' : ''"
            :scroll-y="true"
            :trap-scroll="true"
            :scroll-into-view="scrollIntoView"
            :scroll-with-animation="true"
            :scroll-animation-duration="400"
        >
			<slot></slot>
		</scroll-view>
        <!-- 滚动条 -->
		<view class="scroll-bar" v-if="isIOS">
			<view class="bar" :style="{ transform: transformOffset}"></view>
		</view>
	</view>
</template>

<script>
export default {
    name: 'scroll-bar',
    props: {
        scrollIntoView: {
            type: String,
            default () {
                return ''
            }

        },
        width: {
            type: [String, Number],
            default () {
                return '100'
            }
        },
        height: {
            type: [String, Number],
            default () {
                return 200
            }
        },
        driver: Number
    },
    data () {
        return {
            scrollHeight: 0,
            scrollBarParam: 0,
            transformOffset: 'translate3D(0,0,0)',
            lock: false,
            config: {
                showScrollBar: true
            },
            isIOS: uni.getSystemInfoSync().platform === 'ios',
        }
    },
    computed: {
        scrollStyle () {
            const getSizeCss = (size) => {
                if (typeof size === 'string') {
                    return size + '%'
                } else {
                    return uni.upx2px(size) + 'px'
                }
            }
            return {
                height: getSizeCss(this.height),
                width: getSizeCss(this.width),
            }
        }
    },
    watch: {
        driver () {
            this.initScrollBar()
        }
    },
    created () {
    },
    methods: {
        initScrollBar () {
            if (!this.isIOS) return
            my.createSelectorQuery()
                .select('.scroll-wrapper')
                .boundingClientRect()
                .select('.scroll-bar')
                .boundingClientRect()
                .select('.bar')
                .boundingClientRect()
                .exec(ret => {
                    console.log('ret', ret)
                    this.scrollBarParam =
						((ret[1].height - ret[2].height) * 2) / 100
                    this.scrollHeight = Math.ceil(ret[0].height)
                })
        },
        contentScroll (e) {
            if (!this.scrollHeight) {
                this.initScrollBar()
            }
            if (this.lock) {
                return
            }
            setTimeout(() => {
                this.lock = false
            }, 16)
            const scrollTotal = e.detail.scrollHeight - this.scrollHeight
            const scrollTop = e.detail.scrollTop
            let offsetPercent = (scrollTop / scrollTotal).toFixed(2)
            if (offsetPercent < 0) {
                offsetPercent = 0
            }
            if (offsetPercent > 1) {
                offsetPercent = 1
            }
            this.transformOffset = `translate3D(0,${offsetPercent *
				this.scrollBarParam}rem,0)`
        },
    },
}
</script>

<style scoped lang="less">
.scroll {
	position: relative;
	.scroll-wrapper {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-right: 10upx;
        &.is-ios::-webkit-scrollbar {
            display: none;
        }
		&::-webkit-scrollbar {
			width: 7upx;
			background-color: rgba(255, 69, 58, 0.1);
		}

		/*定义滚动条轨道 内阴影+圆角*/
		&::-webkit-scrollbar-track {
			border-radius: 10upx;
			background-color: rgba(255, 69, 58, 0.1);
		}

		/*定义滑块 内阴影+圆角*/
		&::-webkit-scrollbar-thumb {
			border-radius: 10upx;
			background-color:  #FF453A;
		}
	}
	.scroll-bar {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 7upx;
		right: 0upx;
		background-color: rgba(255, 69, 58, 0.1);
		.bar {
			width: 100%;
			height: 20%;
			background-color: #FF453A;
		}
	}
}
</style>
