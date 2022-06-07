/** 积分系统 */
export default {
    models: {
        userPoint (models) {
            return models.postUserIndex.user.goldNum
        },
        cashShopAwardList: []
    },
    events: {
        // 查询积分商城奖品列表
        async updateCashShopAwardList (vm) {
            const userPoint = vm.$getModel('point.userPoint')
            const list = await vm.$http.getPacketList()
            const resolvedList = list.map(item => vm.$dto2vo('shopAward', item, { userPoint }))
            vm.$updateModel('point.cashShopAwardList', resolvedList)
        },
        // 积分兑奖
        async doCash (vm, shopAwardVO) {
            const userPoint = vm.$getModel('point.userPoint')
            if (shopAwardVO.needGold > userPoint && shopAwardVO.packetLeftNum > 0) {
                uni.showToast({
                    title: '元宝不足'
                })
                return // 积分不足
            } else if (shopAwardVO.packetLeftNum <= 0) {
                uni.showToast({
                    title: '奖品余量不足'
                })
                return // 余量不足
            }
            if (await vm.$dialog.open('CashConfirm', shopAwardVO.needGold)) {
                const cashRes = await vm.$http.postExchangePacket({
                    id: shopAwardVO.id
                })
                vm.$dialog.open('CashResult', (cashRes && cashRes.award) ? cashRes : { award: { awardWorth: '0' } })
                await vm.$triggerEvent('fetchIndexData')
                vm.$triggerEvent('point.updateCashShopAwardList')
                vm.$triggerEvent('queryUserAwards')
            }
        }
    }
}
