import getAlipayMPUser from '@/utils/getAlipayMPUser'

export default {
    // 打开分享面板
    async openSharePannel (vm) {
        if (!uni.canIUse('showSharePanel')) {
            uni.alert({
                title: '提示',
                content: '当前版本不支持唤起分享面板，请点击右上角 "..." 进行分享'
            })
            const userInfo = await getAlipayMPUser(vm.$getModel('indexData.user.userId'))
            await vm.$triggerEvent('updateUserInfo', userInfo)
            uni.showSharePanel()
        }
    },
    // 邀请好友得红包
    async onInviteButtonClick ({
        $triggerEvent,
        $http,
        $getModel,
        $dialog
    }) {
        const activityState = $getModel('indexData.activityStatus')
        if (activityState === 'END') {
            return uni.showToast({
                title: '活动已结束！'
            })
        }
        if (await $dialog.open('InviteGuide')) {
            $triggerEvent('openSharePannel')
        }
    },
    setShareInfo () {

    }
}
