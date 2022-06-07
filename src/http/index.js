import urls from './urls'
import adapters from './adapters'
import request from './request'
import Vue from 'vue'

export default request.generateApis({
    urls,
    adapters,
    store: (key, value) => {
        Vue.prototype.$updateModel(key, value)
    }
})
