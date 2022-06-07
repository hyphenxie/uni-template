export default {
    auth: {
        debug: false,
        useAuth: false, // 是否启用授权
        activityId: 'DL461a4dc57db049f3b6b3d60e2cb89263',
        companyId: '51eb0fcbe77a41c594c9815348edea76',
        appId: 'wxef321783f29e7c73', // 道乐支付宝授权固定为:2021002128610388, 微信为:wxb5c430e03be5d432
        channel: 'wechat', // ali(支付宝)/wechat(微信)/jd(京东)/phone(手机号)/others(其他，浏览器ID)
        authType: 'BASE', // BASE(静默)/USER_INFO(主动授权昵称、头像等)
        defaultHeadImg: 'https://gw.alipayobjects.com/os/q/cms/images/jpaw2djh/2072ae98-e0f3-4dd7-8a9d-6b4cef0ffd4d_w70_h70.png',
        debugUserinfo: { // debug信息，debug为true时的取值
            BROWSER_ID: 'BROWSER_ID_FOR_TEST1212',
            userId: '2088512850919954ssssssss',
            openId: 'oXBu1sx6c_mLf02Def8N9ed8oeYY',
            headImgUrl: 'https://gw.alipayobjects.com/os/q/cms/images/jh8t0l1x/e6a13303-2e10-4043-894d-103c91f43f4a_w102_h103.png',
            nickName: 'nickname',
        },
        authSDK: 'https://dollarcdn.cdollar.cn/dollar/dlAuthCenter_v1.1.4.js'
    }
}
