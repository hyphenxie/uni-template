<template>
	<div class="horizon-broadcast flex-between">
        <div class="sprite-speaker flex-item-fix"></div>
        <div class="broadcast-content flex-center">
            <div class="text" :class="{'end-point': run}">
                首次关注或邀请好友均有机会获得现金红包，红包有限，先到先得
            </div>
        </div>
	</div>
</template>
<script>
export default {
    components: {
    },

    data () {
        return {
            run: false
        }
    },
    mounted () {
        setTimeout(() => {
            this.run = true
        }, 2000)
    }
}
</script>

<style lang="less" scoped>
.horizon-broadcast {
    width: 100%;
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
    font-size: 22upx;
    font-weight: 500;
    color: #FFE4C9;
    // .cross-center;
    padding: 0 30upx;
    .broadcast-content {
        position: relative;
        flex: 1;
        overflow: hidden;
        height: 100%;
    }
    .text {
        position: relative;
        left: 100%;

    }
    .end-point {

        animation: run 10s linear infinite;
    }
    @keyframes run {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(-200%);
        }
    }
}
</style>
