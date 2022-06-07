export default {
    visible: {
        type: Boolean,
        default: false
    },
    wrapper: {
        // wrapper是绝对定位还是fixed定位: 默认是abs定位
        type: String,
        default: 'abs' // fixed\abs
    },
    showModal: {
        type: Boolean,
        default: true
    },
    /** 弹窗层级，用于控制多个弹窗时，弹窗显示先后的问题 */
    zIndex: {
        type: Number,
        default: 1
    },
    /** 弹窗内容层类名
     *  注意: 内容层样式不要设置padding,不然滑动到padding时会触发小程序的滑动穿透
     */
    contentClass: {
        type: String,
        default: 'default'
    },
    /** 动画相关 */
    // 动画时间
    animationDuration: {
        type: Number,
        default () {
            return 0
        }
    },
    // 蒙层进入动画类: 暂未支持拓展
    maskIn: {
        type: String,
        default () {
            return 'fade-in'
        }
    },
    // 蒙层进入动画类
    maskOut: {
        type: String,
        default () {
            return 'none'
        }
    },
    contentIn: {
        type: String,
        default () {
            return 'dialog-slide-in'
        }
    },
    contentOut: {
        type: String,
        default () {
            return 'none'
        }
    }
}
