<template>
	<div class="d-dialog-wrapper"
        :class="wrapperClass"
        v-if="isShow"
        :style="styleObj.wrapper"
        @touchmove.prevent
    >
		<div class="d-dialog-mask"
            :class="[animationClass.mask]"
            @touchmove.prevent
            v-show="showModal"
        ></div>
		<!-- 弹窗内容: 有进出场动效 -->
		<div
            @click.self="$emit('modal-click')"
            class="d-dialog-content"
            :class="[animationClass.content, contentClass]"
        >
			<!-- 页面内容 -->
			<slot></slot>
		</div>
	</div>
</template>

<script>
import properties from './properties'
export default {
    props: properties,
    data () {
        return {
            isShow: this.visible
        }
    },
    computed: {
        // 动画相关类名
        animationClass () {
            return {
                mask: this.visible ? this.maskIn : this.maskOut,
                content: this.visible ? this.contentIn : this.contentOut
            }
        },
        wrapperClass () {
            return this.wrapper === 'fixed' ? 'is-fixed' : 'is-abs'
        },
        styleObj () {
            return {
                wrapper: {
                    zIndex: 999 + this.zIndex
                }
            }
        }
    },
    watch: {
        visible (newVal, oldVal) {
            if (newVal !== oldVal && !newVal) {
                setTimeout(() => {
                    this.isShow = newVal
                }, this.animationDuration)
            } else {
                this.isShow = newVal
            }
        }
    },
    methods: {
        myCatchTouch () {
            return false
        }
    }
}
</script>

<style lang="less" src="./style.less" scoped>
</style>
