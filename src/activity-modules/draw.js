/* 抽奖模块 */
export default {
    models: {
    },
    events: {
        // 签到抽奖区-抽奖
        // 抽奖结果 0未中 1中红包 2中元宝 3中复活卡 4是没有抽奖次数 5是操作过快 45都是为了防刷
        async doDraw (vm, parmas = {}) {
            const { award, result, fund } = await vm.$http.postDraw(parmas)
            // todo 抽奖逻辑
            vm.$triggerEvent('fetchIndexData')
            vm.$triggerEvent('queryUserAwards')
        },
    }
}
