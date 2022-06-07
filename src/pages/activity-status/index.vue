<template>
  <div class="common-page">
    <template v-if="status === 'UPGRADE'">
      <div class="status-pic mb-20">
        <img class="img"
          src="@/images/common/activity-update.png"
          mode="widthFix" />
      </div>
      <div class="common-text mb-40">
        活动正在升级中，客官稍后再来吧～~
      </div>
    </template>
    <template v-else-if="status === 'END'">
      <div class="status-pic mb-20">
        <img class="img"
          src="@/images/common/activity-end.png"
          mode="widthFix" />
      </div>
      <div class="common-text mb-40">
        活动已结束~客官下次请早
      </div>
    </template>
    <template v-else>
      <div class="status-pic mb-20">
        <img class="img"
          src="@/images/common/activity-error.png"
          mode="widthFix" />
      </div>
      <div class="common-text mb-40">
       网络异常，请稍后再试~
      </div>
      <div class="common-button"
        @click="refresh()">刷新试试</div>
    </template>
  </div>
</template>
<script>
import pageMixin from '@/mixins/vue-mixin-page'
export default {
    mixins: [pageMixin('status')],
    components: {},
    data () {
        return {
            // 	NORMAL:活动正常 UPGARDE:活动升级 END:活动结束
            status: '',
        }
    },
    methods: {
        refresh () {
            uni.redirectTo({
                url: '/pages/entry/index',
            })
        },
    },
    onLoad (options = {}) {
        this.status = options.status
    }
}
</script>

<style lang="less" src="./index.less">
</style>
