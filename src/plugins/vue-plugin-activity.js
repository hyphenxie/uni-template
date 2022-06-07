import {
    get,
    set
} from 'lodash'
const VueActivityPlugin = class {
    store = {}

    constructor (modules, options) {
        const {
            events,
            newModules
        } = this.parseModules(modules)
        this.install = (Vue, options) => {
            const $rootVM = Vue.prototype
            const defaultStore = new Vue(this.createStore(newModules.default))
            this.store = defaultStore
            Object.entries(newModules).forEach(([name, mod]) => {
                if (name !== 'default') {
                    this.store[name] = new Vue(this.createStore(mod))
                }
            })
            Vue.prototype.$updateModel = (setStr, newValue) => {
                if (setStr.indexOf('.') >= 0) {
                    const [modelName, key] = setStr.split('.')
                    set(this.store[modelName], key, newValue)
                } else {
                    set(this.store, setStr, newValue)
                }
            }
            Vue.prototype.$getModel = (getStr, feedback) => {
                let model = get(this.store, getStr)

                if (model === undefined) {
                    model = feedback
                }
                return model
            }
            Vue.prototype.$triggerEvent = (strChain = 'someEvent', options = {}) => {
                const [eventName, modName] = ['default', ...strChain.split('.')].reverse()
                const handler = events[modName][eventName]
                if (!handler) return console.warn(`eventName ${strChain} not defined!`)
                return handler($rootVM, options)
            }
        }
    }

    parseModules (modules) {
        const obj = {
            ...modules.modules,
            default: {
                events: modules.events || {},
                models: modules.models || {}
            }
        }
        return Object.entries(obj).reduce((result, [modName, mod]) => {
            const {
                models,
                events,
            } = mod
            const computedModels = {}
            for (const key in models) {
                if (typeof models[key] === 'function') {
                    computedModels[key] = models[key]
                    delete models[key]
                }
            }
            result.newModules[modName] = {
                models,
                events,
                computedModels
            }
            result.events[modName] = events
            return result
        }, {
            events: {},
            newModules: {},
        })
    }

    createStore (mod) {
        const store = this.store
        const obj = Object.entries(mod.computedModels).reduce((obj, [key, computer]) => {
            obj[key] = function () {
                return computer(store)
            }
            return obj
        }, {})
        return {
            data: mod.models,
            computed: obj
        }
    }
}

export default (Vue, activityModules) => {
    const activity = new VueActivityPlugin(activityModules)
    Vue.use(activity)
}
