/**
 * 获取支付宝用户信息，旧版本api，官网已隐藏，随时有下架风险，慎用
 * 可以获取到emoji头像
 * @param {String} userId 用户uid
 */
export default function getAlipayMPUser (userId = '') {
    const userInfo = {
        userId
    }
    return new Promise((resolve, reject) => {
        try {
            getAuthCode('auth_user')
                .then(() => {
                    my.getAuthUserInfo({
                        success: (baseInfo) => {
                            userInfo.headImgUrl = baseInfo.avatar ||
                          'https://gw.alipayobjects.com/os/q/cms/images/jgp0x2iu/578f79e2-7d97-46f8-b5f0-17728d3b83bb_w70_h70.png'
                            userInfo.avatar = baseInfo.avatar ||
                          'https://gw.alipayobjects.com/os/q/cms/images/jgp0x2iu/578f79e2-7d97-46f8-b5f0-17728d3b83bb_w70_h70.png'
                            userInfo.nickName = baseInfo.nickName || (userId ? `用户${userId.substr(userId.length - 4, 4)}` : '匿名用户')
                            resolve(userInfo)
                        },
                        fail: (err) => {
                            reject(new Error(err))
                        }
                    })
                })
        } catch (err) {
            reject(new Error(err))
        }
    })

    function getAuthCode (scopes = 'auth_base') {
        return new Promise((resolve, reject) => {
            my.getAuthCode({
                scopes: scopes,
                success: (res) => {
                    resolve(res.authCode)
                },
                fail: reject
            })
        })
    }
}
