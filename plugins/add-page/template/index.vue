<template>
  <!-- 页面容器 -->
  <PageContainer :loaded="loaded">
    <div class="page-body">

    </div>
    <!-- 弹窗组件 -->
    <template slot="dialog">
    {{#each dialogList}}
      <dialog-{{dialogName}}></dialog-{{dialogName}}>
    {{/each}}
    </template>
  </PageContainer>
</template>
<script>
// 模块组件
import pageMixin from '@/mixins/vue-mixin-page'
export default {
    components: {
    // 组件
    },
    mixins: [pageMixin('privatePageName')],
    data () {
        return {
            loaded: false,
            hash: '',
        }
    },
    computed: {

    },
    watch: {
    },
    methods: {
    },
    events: {
    },
    async onLoad () {
        this.loaded = true
    },
    async onShow () {
    },
    onHide () {
    },
}
</script>

<style lang="less" src="./index.less" scoped>
</style>
