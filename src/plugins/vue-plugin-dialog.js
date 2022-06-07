export default function (Vue, dialogList = {}) {
    const dialogNameList = Object.keys(dialogList).reduce((result, key) => {
        result[key] = false
        return result
    }, {})

    const Dialog = Vue.extend({
        data () {
            return {
                visible: { // 控制弹窗显示/隐藏
                    ...dialogNameList
                },
                openPayload: {
                    ...dialogNameList
                },
                closePayload: {
                    ...dialogNameList
                },
                done: null
            }
        },
        methods: {
            close (name, payload) {
                this.visible[name] = false
                this.$set(this.closePayload, name, payload)

                /** 关闭时返回Promise[resolve] */
                this.done && this.done(payload)
                this.done = null
            },
            open (name, payload) {
                this.visible[name] = true
                this.$set(this.openPayload, name, payload)

                /** 返回一个Promise[pedding] */
                return new Promise((resolve) => {
                    this.done = resolve
                })
            },
            toggle (name, payload) {
                if (this.visible[name]) {
                    return this.close(name, payload)
                } else {
                    return this.open(name, payload)
                }
            }
        }
    })

    Vue.prototype.$dialog = new Dialog()
}
