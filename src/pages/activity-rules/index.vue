<template>
  <PageContainer loaded>
    <div class="page-body">
      <div class="page-title sprite-rules-title1"></div>
      <div class="page-content fb-col-start-center">
        <scroll-view scroll-y
          class="scroll-content mb-20">
          <div v-for="(item, index) in rulesText" :key="index" class="rule-item">
            {{index + 1}}、{{item}}
          </div>
          <!-- <img class="rule-item flex-row" :src="ruleImg" mode="widthFix"/> -->
        </scroll-view>
        <div class="common-button"
          @click="$global.goBack">
          返回首页
        </div>
      </div>
    </div>
    <!-- 弹窗组件 -->
    <template slot="dialog">
    </template>
  </PageContainer>
</template>
<script>
import pageMixin from '@/mixins/vue-mixin-page'
export default {
    mixins: [pageMixin('rules')],
    components: {},
    data () {
        return {
            type: 'rules'
        }
    },
    computed: {
        ruleImg () {
            const info = JSON.parse(this.$getModel('postUserIndex.info') || '{}')
            return info.ruleImg
        },
        rulesText () {
            const info = JSON.parse(this.$getModel('postUserIndex.info') || '{}')
            if (this.type === 'rules') return info.rulesText
            if (this.type === 'rushRules') return info.raiderText
            return []
        }
    },
    methods: {
    },
    async onLoad () {
        // await this.$triggerEvent('fetchIndexData')
        this.$dialog.open('DetentionGuide')
    },
}
</script>

<style lang="less" src="./index.less">
</style>
