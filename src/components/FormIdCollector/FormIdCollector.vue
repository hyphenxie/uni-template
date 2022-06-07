<template>
	<view class="expand_box">
        <form
            :report-submit="true"
            @submit="formSubmit"
        >
            <button class="my-button" form-type="submit" hover-class="none">
                <slot></slot>
            </button>
        </form>
     </view>
</template>

<script>
export default {
    name: 'FormIdCollector',
    // 数据相关
    props: {
        uid: {
            type: [String, Number],
            default () {
                return ''
            }
        }
    },
    data () {
        return {
        }
    },
    computed: {
    },
    // 函数方法
    methods: {
        formSubmit (e) {
            this.$emit('collect', e.detail.formId)
        }
    }
}
</script>

<style scoped lang="less">
	.expand_box {
		position: absolute;
		opacity: 0;
		// background-color: red;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
        bottom: 0;
        right: 0;
        z-index: 100;
        // border: 1px solid red;
        .my-button {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }
	}
</style>
