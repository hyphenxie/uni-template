import DollarRequestMP from './d5-request/DollarRequestMP'
export default new DollarRequestMP({
    options: {
        whiteList: [
            'https://caifuhao.cdollar.cn',
            'https://www.qdollar.cn'
        ],
        NODE_ENV: process.env.NODE_ENV
    }, // axios实例初始化选项
    interceptors: {
        request: [
            (config) => {
                config.url = config.url.replace(/\{([\s\S]*?)\}/g, (match, value) => {
                    return (config.data || config.params)[value]
                })
                return config
            },
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
    },
    exceptionHandler: (error, next) => {
        const {
            errCode,
            body,
            errMessage
        } = error
        if (errCode && errCode !== 'e0001') {
            uni.showToast({
                title: errMessage || body
            })
        } else {
            uni.redirectTo({
                url: '/pages/activity-status/index?status=error'
            })
        }
    },
    useMock: {
        mode: 'off', // local / server
        server: 'http://localhost:3033/mock-middleware/', // use http, 从${serverPath}/{apiName}下面获取mock数据
        includes: []
    },
    showLoading: uni.showLoading,
    hideLoading: uni.hideLoading,
})
