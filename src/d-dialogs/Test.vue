<template>
  <DialogWrapper :zIndex="11" :visible="visible">
        <view class="dialog-content">
            <div class="dialog-title"></div>
            <div class="dialog-tips"></div>
            <div class="dialog-button"></div>
            <div class="dialog-close" @click="close"></div>
        </view>
  </DialogWrapper>
</template>

<script>
const NAME = 'Test'
export default {
    components: {},
    /** 数据属性 */
    props: {},
    data () {
        return {

        }
    },
    computed: {
    // 控制弹窗显示隐藏
        visible () {
            return this.$dialog.visible[NAME]
        },
        openPayload () {
            return this.$dialog.openPayload[NAME]
        },
    },
    /** 方法函数 */
    methods: {
        open () {
            return this.$dialog.open(NAME)
        },
        close () {
            return this.$dialog.close(NAME)
        },
    },
    /** 组件生命周期 */
    created () {},
    mounted () {},
}
</script>

<style lang="less" scoped>

</style>
