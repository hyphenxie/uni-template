import Analytics from '@/utils/Analytics'
export default {
    onAppLaunch (vm, options) {
        const query = options.query || {}
        const extraData = (options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData) || {}
        const channel = query.channel || extraData.channel || 'default'
        vm.$global.appQuery = Object.assign(query, extraData, {
            channel
        })
        Analytics.updatePublicData({ channel: channel })
    },
    getQuery (vm) {
        return {
            ...vm.$global.appQuery,
            ...vm.$global.pageQuery
        }
    },
    async fetchIndexData ({
        $getModel,
        $http,
        $triggerEvent
    }) {
        // 获取默认userId
        // 2088032568910000
        // 2088802298938696
        const debugUserId = '' // 调试用的userId
        const query = $triggerEvent('getQuery')
        const queryUserId = query.userId
        const fromUserId = query.fromUserId
        const defaultUserId = $getModel('postUserIndex.user.userId') || (process.env.NODE_ENV === 'production' ? queryUserId : debugUserId)
        const res = await $http.postGoldIndex({
            inviteStatus: fromUserId ? 0 : 1, // 1 自己进来 0 别人邀请进来
            userId: defaultUserId,
            channel: query.channel,
            code: defaultUserId ? '' : (await uni.getAuthCode())[1].authCode,
            _showLoading: false
        })
        console.log('res', res)
        $http.Request.setCommonParams({
            userId: $getModel('postUserIndex.user.userId')
        })
        $triggerEvent('handleNotifyMessage')
        return res
    },
    // 判断活动状态
    checkActivityState ({
        $getModel
    }) {
        const activityState = $getModel('postUserIndex.activityStatus')
        // 判断活动状态
        // NORMAL : 活动正常 UPGARDE : 活动升级 END : 活动结束
        console.log('activityState:', activityState)
        if (activityState !== 'NORMAL') {
            uni.redirectTo({
                url: `/pages/activity-status/index?status=${activityState}`
            })
        }
    },
    // 处理notifyMessage
    handleNotifyMessage ({
        $dialog,
        $dto2vo,
        $getModel,
        $global
    }) {
        const notifyMessageVOList = $getModel('postUserIndex.notifyMessageVOList') || []
        notifyMessageVOList.forEach(message => {
            if (message.messageType === 'INVITE_AWARD') {
                // $dialog.open('AwardResult', {
                //     scene: 'invite',
                //     inviteNum: message.inviteNum,
                //     awardVO: new Award(message.userAward),
                //     fundVO: message.fund ? $dto2vo(message.fund) : null
                // })
            }
            if (message.messageType === 'NEW_PLAYER') {
                // 统计新人数量
                $global.tj.report('newuser_count', {
                    channel: $global.appQuery.channel || 'default'
                })
            }
        })
    },
}
