import Vue from 'vue'
import config from '../config/index.js'
function loadScript (url, callback) {
    return new Promise(resolve => {
        // 创建一个js
        var script = document.createElement('script')
        script.type = 'text/javascript'
        if (script.readyState) {
        // IE使用
            script.onreadystatechange = function () {
                if (script.readyState === 'conplete' || script.readyState === 'loaded') {
                    callback(resolve)
                }
            }
        } else {
        //  Chrome Safari Opera Firefox使用
            script.onload = function () {
                callback(resolve)
            }
        }
        script.src = url
        // 将js加载到页面上去
        document.head.appendChild(script)
    })
}
/* eslint-disable */
function auth (config) {
    dlAuth.init({
        debug: config.debug,
        channel: config.channel, // ali\wechat\jd
        defaultHeadImg: config.defaultHeadImg,
        debugUserinfo: config.debugUserinfo,
        redirectScope: config.channel === 'wechat' ? config.authType === 'BASE' ? 'snsapi_base' : 'snsapi_userinfo' : 'auth_user', // ali: auth_user; wechat: snsapi_userinfo/snsapi_base; jd: base
        requestScope: config.channel === 'wechat' ? config.authType : 'USER_INFO', // ali: USER_INFO; wechat: USER_INFO/BASE; jd: BASE
        requestParams: { // 微信授权需要传activityId和companyId(appId)
            appId: config.companyId,
            activityId: config.activityId,
        },
        requestUrl: config.channel === 'ali' ? 'https://engine.cdollar.cn/activity-engine/oauth/alipay/2021002128610388' : '',
        appId: config.appId,
        gateway: `https://engine.cdollar.cn/activity-engine/gateway/${config.channel}-project-${new Date().getTime()}`
    })
}

// 注意，授权是会取缓存的，有时候如果改了config.auth里得值不生效，清除一下sessionStroage在编译
export const initAuth = async () => {
    const authSDK = config.auth.authSDK
    return loadScript(authSDK, (resolve) => {
        auth(config.auth)
        resolve()
    })
}
