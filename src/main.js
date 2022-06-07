/* eslint-disable import/first */
import Vue from 'vue'
import App from './App'
// dialog模块
import DialogPlugin from './plugins/vue-plugin-dialog'
import dialogs from './d-dialogs' // 需要文档
Vue.use(DialogPlugin, dialogs)

// activity模块
import ActivityPlugin from './plugins/vue-plugin-activity'
import activityModules from './activity-modules'
Vue.use(ActivityPlugin, activityModules) // 需要文档

// import platformConfig from './config/platformConfig'
// import PlatformPlugin from './plugins/vue-plugin-platform'
// Vue.use(PlatformPlugin, platformConfig)
// http请求模块
import http from './http'
Vue.prototype.$http = http
import urlHandler from './utils/urlHandler'
import Analytics from './utils/Analytics'
import { initAuth } from './utils/auth'
import config from './config/index'
import dto2vo from './objects'
import { myThrottle } from './utils/tools'
Vue.prototype.$dto2vo = dto2vo
Vue.prototype.$global = {
    tj: Analytics,
    appQuery: {},
    pageQuery: {},
    goPage (page, query = {}) {
        const obj2queryString = (obj) => {
            const arr = []
            for (const key in obj) {
                arr.push(`${key}=${obj[key]}`)
            }
            return `?${arr.join('&')}`
        }
        uni.navigateTo({
            url: `/pages/${page}/index?${obj2queryString(query)}`
        })
    },
    goBack () {
        console.warn('goBack')
        uni.navigateBack()
    },
    goAlipaySchema (url) {
        my.ap.navigateToFinance({
            type: 'h5Page',
            url: 'https://ds.alipay.com/?scheme=' + encodeURIComponent(url),
        })
    },
    urlHandler,
    mp2fundDetail (fundCode) {
        return urlHandler(`alipayFinanceApi:type=fundDetail&fundCode=${fundCode}`)
    },
    mp2fundBuy (fundCode) {
        return urlHandler(`alipayFinanceApi:type=fundBuy&fundCode=${fundCode}&amount=10`)
    },
    goLiveRoom (url) {
        my.ap.navigateToFinance({
            type: 'h5Page',
            url: 'https://ds.alipay.com/?scheme=' + encodeURIComponent(url),
        })
    },
    showSharePanel: myThrottle(function () {
        my.showSharePanel()
    }, 1000),
    /** 券列表 */
    openVoucherList () {
        my.openVoucherList()
    },
    sleep: (delay = 0) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, delay)
        })
    }
}
App.mpType = 'app'
/* eslint-disable */
if (config.auth.useAuth) {
    initAuth().then(() => {
        dlAuth.fetchUserinfo().then(user => {
            Vue.prototype.$user = user
            console.log('user', user)
            new Vue({
                ...App
            }).$mount()
        })
    })
} else {
    new Vue({
        ...App
    }).$mount()
}






