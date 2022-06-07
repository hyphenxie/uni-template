<template>
	<button class="follow_lifestyle" open-type="lifestyle" hover-class="none" @followLifestyle="onFollow" :public-id="publicId" v-if="!isFollow">
        <slot></slot>
	</button>
	<div class="follow_lifestyle" @click="$emit('follow')" v-else>
        <slot></slot>
	</div>
</template>

<script>

export default {
    name: 'follow_lifestyle',
    // 数据相关
    props: {
        publicId: {
            type: [String, Number],
            default () {
                return process.env.VUE_APP_publicId
            }
        },
        isFollow: {
            type: Boolean,
            default () {
                return false
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
        async onFollow (e) {
            const followSuccess = e.detail.followStatus === 1 || e.detail.followStatus === true
            if (followSuccess) {
                return this.$emit('follow')
            }
            return this.$emit('cancel')
        }
    }
}
</script>

<style lang="less">
.follow_lifestyle {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100;
}
</style>
