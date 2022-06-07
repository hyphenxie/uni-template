<template>
  <PageContainer :loaded="loaded">
    <div class="page-body fb-col-center">
      <template v-if="displayingAwards.length > 0">
        <div class="awards-container">
          <scroll-view scroll-y class="awards-scroll-wrapper common-frame">
            <AwardCard v-for="awardItem in displayingAwards" :key="awardItem.id" :award="awardItem" type="1"></AwardCard>
          </scroll-view>
        </div>
        <div class="common-button" @click="onGoBack">{{pageType === 'expried' ? '返回' : '返回首页'}}</div>

      </template>
      <template v-else-if="loaded">
        <div class="empty-box flex-center flex-col">
          <i class="sprite-empty-box mb-10"></i>
          <p class="mb-20">
            当前还没有红包哦，
          </p>
          <p class="mb-50">快去每日签到抽奖区参与抽奖领取吧~</p>
          <div class="common-button" @click="onGoBack">返回首页</div>
        </div>
      </template>
    </div>
    <!-- 弹窗组件 -->
    <template slot="dialog">
    </template>
  </PageContainer>
</template>
<script>
import pageMixin from '@/mixins/vue-mixin-page'
export default {
    mixins: [pageMixin('my-awards')],
    components: {},
    data () {
        return {
            list: [],
            pageType: '',
            loaded: false,
        }
    },
    computed: {
        normalAwards () {
            return this.list.filter((item) => !item.expried)
        },
        expriedAwards () {
            return this.list.filter((item) => item.expried)
        },
        displayingAwards () {
            return this.pageType === 'expried'
                ? this.expriedAwards
                : this.normalAwards
        },
    },
    methods: {
        onGoBack () {
            uni.navigateBack({
                delta: 1,
            })
        },
    },
    async onLoad (options = {}) {
        if (!this.$getModel('postUserIndex.user.userId')) {
            await this.$triggerEvent('fetchIndexData')
        }
        this.pageType = options.type
        this.list = await this.$triggerEvent('queryUserAwards')
        setTimeout(() => {
            this.loaded = true
        }, 120)
    },
    onShow () {},
}
</script>

<style lang="less" src="./index.less">
</style>
