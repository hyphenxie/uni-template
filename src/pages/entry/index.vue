<template>
  <!-- 页面容器 -->
  <PageContainer :scrollTop="1"
    :scrollIntoView="hash"
    :scrollAnimationDuration="500"
    :scrollWithAnimation="true"
    :loaded="loaded"
    :absTop="false"
    @on-follow="onFollow"
    >
    <LoadingPage slot="loading"
      :loaded="loaded" />

    <div class="page-body">
        <!-- 头图 -->
        <!-- 图表 -->
        <!-- 比值 -->
        <!-- 卡片 -->
        <!-- 观点 -->
        <view-swiper />
    </div>
    <!-- 弹窗组件 -->
    <template slot="dialog">
    </template>
  </PageContainer>
</template>

<script>

// 模块组件
import pageMixin from '@/mixins/vue-mixin-page'
// 业务组件
import ViewSwiper from './components/ViewSwiper.vue'
export default {
    components: {
        // 组件
        ViewSwiper,
    },
    mixins: [pageMixin('entry')],
    data () {
        return {
            loaded: false,
            hash: '',
        }
    },
    methods: {
    },
    async onLoad () {
        // 首页加载逻辑
        // this.$triggerEvent('fetchIndexData')
        await this.$global.sleep(100) // 模拟接口异步进入，正式编写代码时删除
        this.loaded = true
    },
    async onShow () {
    },
    onHide () {
    },
}
</script>

<style lang="less" src="./index.less" scoped>
.page-body {
  background-color: aliceblue;
}
</style>
