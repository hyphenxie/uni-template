const baseURL = 'https://www.mdollar.cn/dollar-test-jiashi-chongfen/chongfen/' // 测试环境
// const baseURL = 'https://www.qdollar.cn:6443/rush-top' // 生产环境
export default {
    // 点击收藏关注完成任务按钮接口
    postClick: `${baseURL}/chongfen/click`,
    // 清除用户数据接口
    deleteUser: `${baseURL}/chongfen/deleteUser`,
    // 更改活动状态
    getSetActstatus: `${baseURL}/chongfen/setActstatus`,
    // 用户奖品列表接口
    getUserAwards: `${baseURL}/chongfen/userAwards`,
    // 用户关注的基金经理或产品列表
    getUserFunds: `${baseURL}/chongfen/userFunds`,
    // 首页接口
    postUserIndex: `${baseURL}/chongfen/userIndex/{id}`,
    // 用户积分列表接口
    postUserPoints: `${baseURL}/chongfen/userPoints`,
    postFundIndex: `https://fund.cdollar.cn/dl-mc/app/market/fundInc/queryNews`,
}
