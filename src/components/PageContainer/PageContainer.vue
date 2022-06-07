<template>
	<!-- 页面容器 -->
    <div class="wrapper" :class="{'abs-top': absTop}">
        <div class="page-container">
            <slot name="header"></slot>
            <scroll-view class="page-container-body"
                :scroll-y="!isDialogShow"
                :trap-scroll="false"
                :scroll-top="scrollTop"
                :scroll-animation-duration="scrollAnimationDuration"
                :scroll-into-view="scrollIntoView"
                :scroll-with-animation="scrollWithAnimation"
            >
                <div class="content" :class="[{hidden: !loaded }]">
                    <slot></slot>
                </div>
            </scroll-view>
            <slot name="footer"></slot>
            <slot name="dialog"></slot>
        </div>

        <template v-if="useFocusOnFortune">
            <focus-on-fortune @follow="$emit('on-follow')"
        @followAndFavorite="$emit('on-follow')" />
        </template>
        <slot name="loading"></slot>
    </div>
</template>
<script>
export default {
    components: {},
    props: {
        useFocusOnFortune: {
            type: Boolean,
            default () {
                return false
            }
        },
        /**
         * 是否默认absolute定位置顶: 需要沉浸式时设置为true
         */
        absTop: {
            type: Boolean,
            default () {
                return false
            }
        },
        loaded: Boolean,

        /** scroll-view attributes */
        scrollIntoView: {
            type: String,
            default () {
                return ''
            }
        },
        scrollTop: {
            type: [String, Number],
            default () {
                return 1
            }
        },
        scrollAnimationDuration: {
            type: [String, Number],
            default () {
                return '-'
            }
        },
        scrollWithAnimation: {
            type: Boolean,
            default () {
                return false
            }
        },
    },
    data () {
        return {
            isLoading: true,
            loadingFail: false,
            imgsPecent: 90, // 图片加载占比
            loadedimages: 0 // 已加载完成的图片数量
        }
    },
    // 数据相关
    computed: {
        //
        isDialogShow () {
            if (!this.$dialog) return false
            const values = Object.values(this.$dialog.visible)
            return values.includes(true)
        },
    },
}
</script>

<style lang="less" scoped>
.wrapper {
    width: 100vw;
    flex: 1;
	overflow: hidden;
	/*设置flex布局方式*/
	display: flex;
    flex-direction: column;
    &.abs-top {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
    }

}
.page-container {
	/*限制最外层元素的大小，溢出隐藏*/
	position: relative;
    width: 100vw;
    flex: 1;
	overflow: hidden;
	/*设置flex布局方式*/
	display: flex;
    flex-direction: column;

	&-body {
        flex: 1;
        overflow: hidden;
	}

	.content {
        overflow: hidden;
		transition: all 0.5s linear;
        opacity: 1;
		&.hidden {
			opacity: 0;
		}
	}
	.preload_img {
		display: block;
		opacity: 0;
		transform: scale(0);
		position: absolute;
	}
}
</style>
