import eventBus from './bus-events'
import launch from './launch'
import award from './award'
import user from './user'
import point from './point'
import draw from './draw'
export default {
    modules: { draw, point },
    events: {
        ...eventBus,
        ...launch,
        ...award,
        ...user,
        // 判断邀请绑定关系
        checkInviteBind ({
            $global,
            $getModel,
            $http,
            $triggerEvent
        }) {
            const indexData = $getModel('postUserIndex')
            const query = $triggerEvent('getQuery')
            const {
                fromUserId,
                id
            } = query || {}
            const currentUserId = indexData.user.userId
            console.log('query', currentUserId, fromUserId)
            if (fromUserId && fromUserId !== currentUserId && indexData.user.inviteStatus === 0 && !id) {
                $http.postInvite({
                    inviteUserId: fromUserId,
                    userId: indexData.user.userId
                }, err => console.warn(err))
            }
        },

        // 关注并领取新人礼
        async reveiveNewGift ({
            $updateModel,
            $getModel,
            $global,
            $http,
            $dialog,
            $triggerEvent
        }) {
            const activityState = $getModel('indexData.activityState')
            if (activityState === 'END') {
                return uni.showToast({
                    title: '活动已结束！'
                })
            }
            const userId = $getModel('indexData.user.userId')
            const {
                follow
            } = await $http.postFollow({
                userId
            })
            if (follow === 'YES' || await $dialog.open('FollowGuide')) {
                // 调用领取新人礼的接口
                console.log('关注～')
                const award = await $http.postSendFollowPacket({
                    type: 'SEND',
                    userId
                }, (err, next) => {
                    console.log(err)
                    next({
                        awardMoney: 0
                    })
                })

                // 展示新人礼领取结果弹窗
                $dialog.open('FollowPrize', award)

                // 刷新首页数据
                $triggerEvent('fetchIndexData')

                // 邀请绑定：在领取新人礼之后调用
                const {
                    fromUserId
                } = $global.pageQuery.entry || {}
                console.warn('fromUserId', fromUserId)

                const currentUserId = $getModel('indexData.user.userId')
                if (fromUserId && fromUserId !== currentUserId) {
                    $http.postInvite({
                        inviteUserId: fromUserId,
                        userId: currentUserId,
                    })
                }
            }
            return true
        },

    },
    models: {
        postGameList: {},
        getTime: '',
        indexData: {
            activityStatus: 'NORMAL',
            info: null,
            tipDrawStatus: null,
            userId: '1',
            user: {
                userId: '1',
                nickName: '匿名昵称',
                headImgUrl: null,
                channel: null,
                drawTimes: 1,
                goldNum: 0,
                reviveCard: null,
                inviteStatus: 1,
                updateTime: null,
                createTime: '2021-01-30 14:45:23'
            },
            notifyMessageVOList: [],
            fundList: [],
            bannerList: [],
            recommendList: [],
            ruleImg: null,
            inviteAward: {
                id: 1,
                packetId: 'wcR4IA-9b47SL0c_CW10GTUFVRnS67lv9grOYiM84I6sn4ge4wBRFkiLOjq1h1Jd',
                packetName: '0.30元现金红包',
                packetType: 'ALIPAY_CASH',
                packetWorth: 0.3,
                packetImg: 'www.123.png',
                inviteNum: 3,
                inviteLimit: 6,
                companyCode: 'DOLLAR',
                companyName: '道乐科技'
            }
        },
        postUserIndex: {
            activityStatus: 'NORMAL',
            bannerList: [],
            fundList: [],
            gameList: [],
            info: '{}',
            inviteAward: {
                id: 0,
                inviteLimit: 0
            },
            notifyMessageVOList: [],
            recommendList: [],
            ruleImg: '规则图片',
            signVO: {
                commonNum: 0,
                signNum: 0,
                signSuccessFlag: false,
                specialNum: 0,
                useCommonNum: 0,
                useSpecialNum: 0
            },
            tipDrawStatus: false,
            user: {
                channel: '用户渠道',
                createdTime: '创建时间',
                drawTimes: 0,
                goldNum: 0,
                headImgUrl: '用户头像',
                inviteStatus: 0,
                nickName: '用户昵称',
                reviveCard: 0,
                signNum: 0,
                updatedTime: '更新时间'
            },
            userId: '用户ID'
        },
        staticInfo: {
            fund_tab_left: '严选好货1',
            fund_tab_right: '海货淘金',
            surpriseText: '',
            period: ''
        },
        userAwards: [],
        shareInfo: {},
        user: {}
    }
}
