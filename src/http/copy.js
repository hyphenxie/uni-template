const baseURL = 'https://activity.mynatapp.cc/dollar-test-rush-top' // 测试环境
// const baseURL = 'https://www.qdollar.cn:6443/rush-top' // 生产环境
export default {
    // 获取资产历史
    postAssetsLogs: `${baseURL}/api/experience/v1/assetsLogs`,
    // 上周中奖名单
    postAwardLastWeek: `${baseURL}/api/experience/v1/awardLastWeek`,
    // 关闭气泡
    postDeleteQPMessage: `${baseURL}/api/experience/v1/deleteQPMessage`,
    // 查询基金净值
    postFundNetValues: `${baseURL}/api/experience/v1/fundNetValues`,
    // 获取服务器当前时间
    postGetDate: `${baseURL}/api/experience/v1/getDate`,
    // 邀请数量查询
    postGetInvite: `${baseURL}/api/experience/v1/getInvite`,
    // 获取模拟交易决策点与批次号
    postGetMockFund: `${baseURL}/api/experience/v1/getMockFund`,
    // 查询体验金中心首页
    postGoldIndex: `${baseURL}/api/experience/v1/goldIndex`,
    // 资产排行榜
    postMaxAssets: `${baseURL}/api/experience/v1/maxAssets`,
    // 基金收益排行榜
    postMaxFundIncomeRate: `${baseURL}/api/experience/v1/maxFundIncomeRate`,
    // 模拟交易
    postMockTrade: `${baseURL}/api/experience/v1/mockTrade`,
    // 查询我的奖品
    postMyPrize: `${baseURL}/api/experience/v1/myPrize`,
    // 领取口令红包接口
    postRecTokenPacket: `${baseURL}/api/experience/v1/recTokenPacket`,
    // 领取倒计时奖励
    postReceiveCountdown: `${baseURL}/api/experience/v1/receiveCountdown`,
    // 订阅消息
    postReserve: `${baseURL}/api/experience/v1/reserve`,
    // 解锁基金
    postUnLockFund: `${baseURL}/api/experience/v1/unLockFund`,
    // 取消订阅消息
    postUnReserve: `${baseURL}/api/experience/v1/un_reserve`,
    // 更新关注/持仓记录变化接口
    getUpdataUserData: `${baseURL}/api/experience/v1/updataUserData`,
    // 更新用户信息
    postUpdateUserInfo: `${baseURL}/api/experience/v1/updateUserInfo`,
}