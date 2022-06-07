const {
    DialogList,
    pageList
} = require('../../auto.config.js')

export default (pageName) => {
    return {
        async onLoad (options) {
        // 更新页面启动参数
            uni.$emit('pageLoad', {
                pageName,
                query: options || {},
            })
            uni.$on('pageScrollTo', (hash) => {
                this._hash = hash
            })
        },
        onShow () {
            // 解决直接返回上一页面，不关闭弹窗时，页面被禁止滚动的问题。但相应的配置信息需要完整
            const pageConfig = pageList.find(page => page.pageName === pageName)
            if (pageConfig && DialogList) {
                DialogList.filter(dialog => pageConfig.relativeDialog.indexOf(dialog) < 0).forEach(item => {
                    this.$dialog.close(item)
                })
            }
            uni.$emit('pageShow', pageName)
        },
        onHide () {
            uni.$emit('pageHide', pageName)
        },
        onShareAppMessage () {
            const commonShareInfo = {
                title: '你有一份新年现金红包待开启',
                desc: `领新年现金红包，参加冲顶答题瓜分现金奖池`,
                path: `/pages/entry/index?fromUserId=${this.$getModel('postUserIndex.user.userId')}`,
                bgImgUrl: 'https://dlcdn.cdollar.cn/frontend/projects/dollar-lhhd/share.png' // 分享图片
            }
            console.log('分享信息：', commonShareInfo)
            return commonShareInfo
        },
    }
}
