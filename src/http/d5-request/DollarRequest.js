// use开头的都是单独的功能，后面考虑做成插件的形式，可以实现treeshaking
/**
 * Promise
 * 调用方式：const res = await apis.getIndexData(params, onError)
 * 如果正常返回就使用res，如果异常返回就会走onError（err，next）,如果调用next就会返回
 * 如何判断是否正常返回呢？正常axios是看http请求返回状态码200正常，其它异常；实际看拦截器的最终实现
 * 默认的拦截器有哪些功能？1. loading；2. 参数占位符
 * params分三种形式：1. 正常key识别为接口入参；2. $开头的$key识别为axios的config；3. 下划线开头的_key识别为特殊功能，$loading
 */
import _axios from 'axios'
import {
    merge
} from 'lodash'
import RequestGuard from './RequestGuard'
export default class DollarRequest {
    // axios 实例化入参，默认值
    defaultAxiosConfigs = {
        // adapter: mpAdapter // 小程序axios适配器，如果是非小程序，不需要此配置
    }

    finalAxiosConfigs = {}

    // 默认自定义配置
    defaultCustomOptions = {
        showLoading: true
    }

    // 公共请求参数
    commonParams = {}

    // 默认拦截器配置
    interceptors = {
        request: [
            config => config,
            error => Promise.reject(error)
        ],
        response: [
            (res) => {
                const {
                    body,
                    errCode
                } = res.data
                if (errCode !== 'e0000') {
                    return Promise.reject(res.data)
                }
                return body
            },
            error => {
                return Promise.reject(error)
            }
        ]
    }

    showLoading = () => {
        console.log('showLoading...')
    }

    hideLoading = () => {
        console.log('hideLoading...')
    }

    exceptionHandler = null

    constructor (initOptions, adapter = undefined) {
        const {
            // 必选入参
            options,
            interceptors,
            urls,
            // 可选入参
            exceptionHandler,
            showLoading,
            hideLoading,
        } = initOptions
        this.initOptions = initOptions
        this.finalAxiosConfigs = Object.assign(this.defaultAxiosConfigs, {
            adapter
        }, options)
        this.axiosInstance = _axios.create(this.finalAxiosConfigs)

        // 请求、响应拦截器
        this._useInterceptors(interceptors)

        this.exceptionHandler = exceptionHandler
        // use开头的选项都设置为全局的个性化选项
        Object.keys(initOptions).forEach(key => {
            if (/^use/.test(key)) {
                this.defaultCustomOptions[key] = initOptions[key]
            }
        })
        this.setCommonParams = (params) => {
            Object.assign(this.commonParams, params)
        }
        // loading\hideLoading 的实现
        showLoading && (this.showLoading = showLoading)
        hideLoading && (this.hideLoading = hideLoading)

        this.axiosWrapper(this.axiosInstance)
    }

    // 请求、响应拦截器
    _useInterceptors (interceptors) {
        // 请求拦截
        interceptors = merge({}, this.interceptors, interceptors)
        const [request, requestError] = interceptors.request
        const [responseHandler, responseError] = interceptors.response
        this.axiosInstance.interceptors.request.use(
            (config) => request(this._request(config), this),
            (error) => requestError(error, this)
        )
        // 响应拦截
        this.axiosInstance.interceptors.response.use(
            (response) => responseHandler(response, this),
            (error) => responseError(error, this)
        )
    }

    // 内置拦截器
    _request (config) {
        const options = this.initOptions.options || {}
        this.guard = this.guard || new RequestGuard('uni', options.NODE_ENV, this.initOptions.options.whiteList)
        this.guard.check(config)
        return config
    }

    // urls ->  apis
    generateApis ({ urls, adapters, store }) {
        return Object.entries(urls).reduce((apiObj, [name, url]) => {
            // 通过命名约定，判断请求方法，默认get请求
            const method = [
                'get',
                'post',
                'put',
                'delete'
            ].find(m => name.startsWith(m)) || 'get'
            apiObj[name] = async (params, onError) => {
                const res = await this[method](url, params, onError)
                if (adapters && Object.prototype.hasOwnProperty.call(adapters, name)) {
                    res.handled = adapters[name](res)
                }
                store && store(name, res)
                return res
            }
            return apiObj
        }, {
            Request: this
        })
    }

    /** 参数解析
     * $开头，解析为请求的config，同axios的config
     * _开头，解析为请求的自定义配置项，自定义配置支持列表见useXXXX
     * 其它：接口请求的真实参数
     */
    resolvePayload (payload) {
        const isArrayPayload = Object.prototype.toString.call(payload) === '[object Array]'
        const requestParams = isArrayPayload ? [] : Object.assign({}, this.commonParams)
        const axiosConfigs = Object.assign({}, this.defaultAxiosConfigs)
        const customOptions = Object.assign({}, this.defaultCustomOptions)
        Object.keys(payload || {}).forEach(key => {
            if (/^\$/.test(key)) { // is option
                axiosConfigs[key.replace('$', '')] = payload[key]
            } else if (/^_/.test(key)) { // is config
                customOptions[key.replace('_', '')] = payload[key]
            } else { // is params
                requestParams[key] = payload[key]
            }
        })
        return {
            requestParams,
            axiosConfigs,
            customOptions
        }
    }

    // 获取数据
    fetchServerData (mockServer, apiName) {
        this.axiosForMock = this.axiosForMock || _axios.create(this.finalAxiosConfigs)
        return async (rConfig) => {
            const url = `${mockServer}/${apiName}`
            rConfig.url = url
            delete rConfig.adapter
            return this.axiosForMock(rConfig)
        }
    }

    axiosWrapper (instance) {
        const arr = ['post', 'get', 'put', 'delete']
        return arr.reduce((obj, method) => {
            obj[method] = async (url, params, onError) => {
                let {
                    requestParams,
                    axiosConfigs,
                    customOptions
                } = this.resolvePayload(params)

                // 自定义配置： showLoading 、isFormData
                customOptions.showLoading && this.showLoading()

                // 处理入参是formData
                if (customOptions.isFormData) {
                    const form = new FormData()
                    Object.entries(requestParams).forEach(([key, value]) => {
                        form.append(key, value)
                    })
                    requestParams = form
                }

                // 开启缓存
                if (customOptions.useCache) {
                    // TODO: 判断入参，相同的入参且缓存有数据，直接拿本地缓存的数据
                }

                // 开启接口mock
                if (customOptions.useMock && customOptions.useMock.mode !== 'off') {
                    const useMock = !customOptions.useMock.includes || customOptions.useMock.includes.includes(name)
                    if (useMock) {
                        axiosConfigs.adapter = this.fetchServerData(customOptions.useMock.server, name)
                    }
                }
                let retryTimes = customOptions.retryTimes || 0
                const requestHandler = () => {
                    return new Promise(async resolve => {
                        try {
                            const res = await instance[method](url, requestParams, axiosConfigs)
                            customOptions.showLoading && this.hideLoading()
                            resolve(res)
                        } catch (error) {
                            if (retryTimes > 0) {
                                retryTimes--
                                return requestHandler()
                            }
                            customOptions.showLoading && this.hideLoading()
                            if (onError) {
                                await onError(error, resolve)
                            } else {
                                (typeof this.exceptionHandler === 'function') && await this.exceptionHandler(error, resolve)
                            }
                        }
                    })
                }
                return requestHandler()
            }
            this[method] = obj[method]
            return obj
        }, {})
    }

    _requestCore (method, url, params, onError) {
        return this.axiosInstance({
            method,
            url,
            data: params
        })
    }
}
