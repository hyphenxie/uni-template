import axios from 'axios' // 原生
import mpAdapter from 'axios-miniprogram-adapter'
import md5 from 'md5'
class PlatformService {
    UTILS = {
        axios: axios,
        md5: md5
    }

    CONFIG_DEFAULT = {
        type: 'ALIPAY_USER_ID', // 凭证值的类型, 常用: ALIPAY_USER_ID/WECHAT/BROWSER_ID/MOBILE
        authKey: this.UTILS.browserId, // 首次初始化非必填，但这个值必须设置，初始化之后可调用setAuthKey（{authKey}）方法设置凭证值
        appId: 'a7589c3e890b4280bb943790e545dd3a', // 活动平台的企业ID companyId
        activityId: 'DL5ba30e0c790b4549921d18f8a4207eb2', // 活动Id
    }

    CONFIG_CUSTOM = {}

    CONFIG_HTTP = {
        baseURL: 'https://engine.cdollar.cn/activity-engine/',
        contenType: 'application/json'
    }

    instance = null

    http = axios

    ajaxData = { // 接口请求公共参数
        activityId: null,
        type: null,
        appId: null,
        authKey: null,
        sign: null
    }

    constructor (options) {
        this.CONFIG_CUSTOM = { ...this.CONFIG_DEFAULT, ...options }
        // 获取初始化时的接口请求公共参数
        // eslint-disable-next-line no-unused-vars
        for (const key in this.ajaxData) {
            this.ajaxData[key] = this.CONFIG_CUSTOM[key]
        }
        // 初始化签名sign
        this.ajaxData.sign = this.getSign()
        // 初始化http请求
        this.__httpSetting()
        return this
    }

    // 请求拦截器
    __httpSetting () {
        const _axios = this.UTILS.axios
        this.http = _axios.create(this.CONFIG_HTTP)
        if (this.CONFIG_CUSTOM.client === 'mp') {
            this.http.defaults.adapter = mpAdapter
        }
        this.http.interceptors.request.use((config) => {
            if (this.CONFIG_CUSTOM.client === 'mp') {
                config.url = this.CONFIG_HTTP.baseURL + config.url
            }
            const method = config.method.toLowerCase()
            if (this.CONFIG_CUSTOM.forcops) { // 外透后缀
                config.url += '.forcops'
            }
            if (method === 'post' || method === 'put') { // post/put 请求url带上sign，并带上公共参数
                if (config.data && config.data.authKey) this.setAuthKey(config.data.authKey) // 如果传了authKey则刷新sign的值
                config.url += `?sign=${this.ajaxData.sign}`
                config.data = { ...this.ajaxData, ...config.data }
            } else if (method === 'get' || method === 'delete') {
                if (config.params && config.params.authKey) this.setAuthKey(config.params.authKey) // 如果传了authKey则刷新sign的值
                config.params = { ...this.ajaxData, ...config.params }
                config.params.requestTime = Date.now() // 可解决安卓get请求缓存问题
            }
            return config
        }, error => {
            return Promise.reject(error)
        })
        this.http.interceptors.response.use(response => {
            if (response && response.data && response.data.message) { // 出错走catch
                this.errHandler(response.data) // 异常处理
                return Promise.reject(response.data)
            }
            return Promise.resolve(response.data)
        }, error => {
            return Promise.reject(error)
        })
    }

    getSign () {
        const keyGroup = `${this.ajaxData.activityId}_${this.ajaxData.authKey}_${this.ajaxData.type}`
        return this.UTILS.md5(keyGroup)
    }

    // 设置抽奖凭证值，并刷新签名sign
    setAuthKey (authKey = '') {
        this.ajaxData.authKey = authKey
        this.ajaxData.sign = this.getSign()
    }

    // 设置活动ID
    setActivityId (activityId = '') {
        this.ajaxData.activityId = activityId
        this.ajaxData.sign = this.getSign()
    }

    // 设置凭证类型
    setAuthType (type = '') {
        this.ajaxData.type = type
        this.ajaxData.sign = this.getSign()
    }

    /** 接口列表 */
    // 查活动状态（未开始、进行中、暂停、结束）
    queryStatus (params = {}) {
        let dailyLeft, totalLeft, errMsg, shareState
        return this.http.get(`info/${this.ajaxData.activityId}`, { params }).then(res => {
            if (!res) { // 接口没返回东西说明没有authkey,这种情况默认用户有抽奖次数
                // errMsg = 'AUTHKEY_IS_NULL'
                console.warn('查抽奖次数时，未传authkey的值')
                dailyLeft = 1
                totalLeft = 1
            } else {
                totalLeft = res.gameTotalTimesLimit - res.playerTotalTimes // 超过总抽奖次数
                dailyLeft = Math.max(0, Math.min(totalLeft, res.gameDayTimesLimit - res.playerDayTimes)) // 每日抽奖次数不能大于总抽奖次数
                shareState = res.shareState
            }
            return {
                errMsg,
                dailyLeft,
                totalLeft,
                shareState,
                originalData: res
            }
        }).catch(err => {
            if (err.message) { // 活动未开始\暂停\结束状态 抽奖次数返回0
                errMsg = err.message
                dailyLeft = 0
                totalLeft = 0
            } else {
                errMsg = '网络错误'
            }
            return {
                errMsg,
                dailyLeft,
                totalLeft,
                shareState,
                originalData: err
            }
        })
    }

    // 查询中奖用户
    queryLuckyUsers () {
        return this.http.get(`display/${this.ajaxData.activityId}`)
            .then(res => {
                return Promise.resolve(res.displayList)
            }).catch(err => {
                return Promise.reject(err)
            })
    }

    // 查询奖品列表
    queryAwards (params = {}) {
        return this.http.get('draw', { params })
            .then(res => {
                return Promise.resolve(res.trophyItems)
            }).catch(err => {
                return Promise.reject(err)
            })
    }

    // 查询奖品配置
    queryTrophyList (params = {}) {
        return this.http.get(`${this.ajaxData.activityId}/trophyList`, { params })
            .then(res => {
                return Promise.resolve(res)
            }).catch(err => {
                return Promise.reject(err)
            })
    }

    // 抽奖
    postDraw (params = {}) {
        return this.http.post('draw', params)
            .then(res => {
                return Promise.resolve(res.trophyItems[0])
            }).catch(err => {
                return Promise.reject(err)
            })
    }

    // 兑奖
    postCash (params = {}) {
        return this.http.post('userInfo', params)
    }

    // 获取手机验证码
    getSms (params = {}) {
        return this.http.post(`sms`, params)
    }

    // 获取图片验证码
    getVerifyCode (params = {}) {
        return this.http.get(`verifyCode`, { params })
    }

    // 查询分享信息
    queryShareInfo () {
        return this.http.get(`act/share/${this.ajaxData.activityId}`)
    }

    // 获取微信分享签名接口
    getWxSignature (params = {
        url: location.href.split('#')[0]
    }) {
        return this.http.get(`wechatSignature`, { params })
    }

    // 查活动配置
    queryConfig (params = {}) {
        return this.http.get(`${this.ajaxData.activityId || params.activityId}/drawConfig`, { params })
    }

    // 提交字符串信息
    postString (params = {}) {
        if (!params.stringValue) return Promise.reject('required key stringValue no exist')
        return this.http.post(`${this.ajaxData.activityId}/gameString`, params)
    }

    // 查询提交信息
    queryString (params = {}) {
        return this.http.get(`${this.ajaxData.activityId}/gameScore`, { params })
    }

    // 用户传播信息收集
    postPass (params = {}) {
        if (params.fromOpenId === undefined) return Promise.reject('required key fromOpenId no exist')
        return this.http.post(`torch/pass/${params.fromOpenId}`, params)
    }

    // 查询分享传播者信息
    queryPassInfo (params = {}) {
        return this.http.get(`torch/${this.ajaxData.activityId}/shareInfo/${params.queryAuthKey || params.authKey || this.ajaxData.authKey}`, {
            params
        })
    }

    // 查询手机号码关联
    queryPhonesRelation (params = {}) {
        return this.http.get(`${this.ajaxData.appId}/phones`, { params })
    }

    // 分享操作,调用之后用户的状态切换为已分享
    shareAction (params = {}) {
        return this.http.post(`action/share`, params)
    }

    // 页面事件上传，在用户关闭页面时统一将数据POST到后台（待定）
    postEvents (params = {}) {
        return this.http.post(`statistics/pageView`, params)
    }

    setErrorHandler (handler) {
        this.errHandler = handler
    }

    errHandler () {}
}

export default {
    install: function (Vue, platformConfig) {
        Object.keys(platformConfig).forEach(key => {
            const platform = new PlatformService(platformConfig[key])
            Vue.prototype[`$${key}`] = platform
        })
    }
}
