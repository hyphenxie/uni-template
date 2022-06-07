<template>
    <span class="profit_value" :class="['profit_value-type_' + symbolType, className]" :style="{color: color}">
        <span>{{preSymbol}}</span>
        {{valueAbsStr || ''}}
        <!-- <span v-if="type === 'rate'">%</span> -->
    </span>
</template>

<script>
import { isNull } from 'lodash'
export default {
    props: {
        className: String,
        type: {
            type: String,
            default () {
                return 'rate' // value | rate
            }
        },
        value: {
            type: Number,
            default () {
                return 0
            }
        },
        lgt0: {
            type: String,
            default () {
                return 'red'
            }
        },
        smt0: {
            type: String,
            default () {
                return 'green'
            }
        },
        eqt0: {
            type: String,
            default () {
                return '#ccc'
            }
        },
        precision: {
            type: Number,
            default () {
                return 2
            }
        },
    },
    data () {
        return {}
    },
    computed: {
        // >=0 \ <0 \ 没数据
        color () {
            return isNull(this.value) ? this.eqt0
                : this.value > 0 ? this.lgt0
                    : this.value < 0 ? this.smt0
                        : this.eqt0
        },
        // >=0 \ <0 \ 没数据
        preSymbol () {
            return this.value > 0 ? '+'
                : this.value < 0 ? '-' : ''
        },
        // >=0 \ <0 \ 没数据
        valueAbsStr () {
            return isNull(this.value) ? '--' : Math.abs(Number(this.value)).toFixed(this.precision)
        },
        symbolType () {
            return isNull(this.value) ? '' : this.type
        }
    },
    methods: {}
}
</script>

<style lang="less">
    .profit_value {
        line-height: inherit;
        white-space: nowrap;
        &-type_rate {
            &::before {
                content: ''
            }
            &::after {
                content: '%'
            }
        }
        span {
            line-height: inherit;
        }
    }
</style>
