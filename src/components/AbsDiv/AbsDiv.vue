<template>
  <div class="absDiv" :style="[styleObj.base]"
    :class="['absDiv-' + position, className]"
    @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script>
export default {
    props: {
        debug: Boolean,
        className: String,
        // 背景：图
        bgSrc: null,
        // 尺寸：width、height
        size: {
            type: Array,
            default () {
                return []
            }
        },
        width: {
            type: [Number, String],
            default: null,
        },
        height: {
            type: [Number, String],
            default: null,
        },
        // 位置：left、top、right、bottom ｜ center、horizon-center、vertical-center
        position: {
            type: [Array, String],
            default () {
                return []
            }
        },
        left: {
            type: [Number, String],
            default: null,
        },
        top: {
            type: [Number, String],
            default: null,
        },
        right: {
            type: [Number, String],
            default: null,
        },
        bottom: {
            type: [Number, String],
            default: null,
        },
        zIndex: {
            type: Number,
            default: 1
        }

    },
    computed: {
        styleObj () {
            const size = {
                width: this.width || this.size[0],
                height: this.height || this.size[1],

            }
            const position = typeof this.position === 'string' ? {
                left: this.left,
                top: this.top,
            } : {
                left: this.left || this.position[0],
                top: this.top || this.position[1],
                right: this.right || this.position[2],
                bottom: this.bottom || this.position[3],
            }
            const container = this.bgSrc ? {
                backgroundImage: `url(${this.bgSrc})`,
                backgroundSize: `100% auto`,
                backgroundRepeat: `no-repeat`,
            } : {}
            const box = Object.assign(size, position, container)

            const transfer = (s) => {
                if (typeof s === 'string') {
                    return `${s}%`
                }
                return uni.upx2px(s)
            }

            // 删除值为null的key，并转换值为非null的value
            for (const key in box) {
                if (box[key] === null || box[key] === undefined) {
                    delete box[key]
                } else {
                    box[key] = transfer(box[key])
                }
            }
            return {
                // 热区基础样式
                base: {
                    position: 'absolute',
                    // 热区层级
                    zIndex: this.zIndex,
                    // 热区位置与尺寸
                    ...box,
                    ...this.debug ? {
                        border: `1px solid blue`
                    } : {}
                },
                // 在特殊环境下的可视化样式
                dev: {
                    backgroundColor: 'rgba(0,0,0,.2)',
                }
            }
        },
    }
}
</script>

<style lang="less" scoped>
.absDiv {
    // display: flex;
    // align-items: center;
    // padding-left: 30upx;
}
.absDiv-horizon-center {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
}
.absDiv-vertical-center {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
.absDiv-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}
</style>
