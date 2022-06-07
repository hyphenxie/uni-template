<script>
export default {
    data () {
        return {
            startTime: ''
        }
    },
    onLaunch: function (options = {}) {
        this.$triggerEvent('onAppLaunch', options)
        // 断网判断
        // 获取网络状态。不可用则错误处理
        uni.getNetworkType({
            success: (res) => {
                if (res.networkType === 'none') {
                    uni.$emit('offline')
                }
                if (['3g', '2g'].includes(res.networkType)) {
                    uni.$emit('slow3g')
                }
            },
        })
        // 监听网络状态的变化
        uni.onNetworkStatusChange(function (res) {
            if (res.networkType === 'none') {
                uni.$emit('offline')
            }
            if (['3g', '2g'].includes(res.networkType)) {
                uni.$emit('slow3g')
            }
        })

        // 更新app启动参数
        uni.$on('offline', () => {
            uni.redirectTo({
                url: '/pages/activity-status/index',
            })
        })
        // 更新app启动参数
        uni.$on('slow3g', () => {
            uni.showToast({
                title: '当前网速较慢，请耐心等待',
            })
        })
        // 更新页面启动参数
        uni.$on('pageLoad', ({ pageName, query }) => {
            if (!this.$global.pageQuery) {
                this.$global.pageQuery = {}
            }
            this.$global.pageQuery = Object.assign(this.$global.pageQuery, query)
            this.$global.pageQuery[pageName] = query
        })
        // 保存全局参数
        uni.$emit('updateAppQuery', options || {})
        this.$global.tj.report('channel', {})
    }
}
</script>
<style lang="less">
@import "./styles/global-class.less";
@import "./d-dialogs/public.less"; // 弹窗公共样式

/*全局样式*/
page {
  /*限制最外层元素的大小，溢出隐藏*/
  width: 100vw;
  height: 100vh;
  font-family: PingFang SC, sans-serif; // 这里为全局字体通常不需要额外设置字体
  /*设置flex布局方式*/
  display: flex;
  box-sizing: border-box; // 这行是必须的，因为收藏&关注组件的原理类似于给page元素添加padding
  color: @color-primary;
  font-size: @fs-primary;
}
</style>
