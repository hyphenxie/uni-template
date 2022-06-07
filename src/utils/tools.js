// design2device
import moment from 'moment'
export const d2d = (size) => {
    const sysInfo = uni.getSystemInfoSync()
    const windowWidth = sysInfo.windowWidth
    const designWidth = 750
    if (typeof size === 'string') {
        return `${size}%`
    }
    return `${size * (windowWidth / designWidth)}px`
}
export const d2dNum = (size) => {
    const sysInfo = uni.getSystemInfoSync()
    const windowWidth = sysInfo.windowWidth
    const designWidth = 750
    return size * (windowWidth / designWidth)
}

// 限制取值范围
export const getBorderValue = (num, min, max) => {
    return Math.max(Math.min(num, max), min)
}

// find key from searchStr
export function queryUrlParam (key, search) {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    search = search.split('?')
    const r = search[search.length - 1].match(reg)
    if (r != null) return decodeURIComponent(r[2])
    return null
}
/** 处理YYYYMMDD字符串 */
export const dayStrtoDate = (str, connector = '-') => `${String(str).substr(0, 4)}${connector}${String(str).substr(4, 2)}${connector}${String(str).substr(6, 2)}`

export function thousandsToNum (str, thousandsSep = ',') {
    return String(str).replace(',', '') - 0
}
/** 金额保留两位小数 */
export function toMoneyNum (num) {
    return Number(num).toFixed(2)
}

export function urlToObj (url) {
    const string = url.split('&')
    const res = {}
    for (let i = 0; i < string.length; i++) {
        const str = string[i].split('=')
        if (str[0] !== '') {
            res[str[0]] = str[1]
        }
    }
    return res
}

export function getQueryString (str, name) {
    const search = str.split('?')[1]
    if (search) {
        const params = search.split('&')
        for (var i in params) {
            var param = params[i].split('=')
            if (param[0] === name) {
                return param[1]
            }
        }
    }
    return null
}

export const group = (array, subGroupLength) => {
    let index = 0
    const newArray = []
    while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength))
    }
    return newArray
}

export const isEmojiCharacter = (substring) => {
    for (var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i)
        if (hs >= 0xd800 && hs <= 0xdbff) {
            if (substring.length > 1) {
                const ls = substring.charCodeAt(i + 1)
                const uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000
                if (uc >= 0x1d000 && uc <= 0x1f77f) {
                    return true
                }
            }
        } else if (substring.length > 1) {
            const ls = substring.charCodeAt(i + 1)
            if (ls === 0x20e3) {
                return true
            }
        } else {
            return (
                (hs >= 0x2100 && hs <= 0x27ff) ||
                (hs >= 0x2B05 && hs <= 0x2b07) ||
                (hs >= 0x2934 && hs <= 0x2935) ||
                (hs >= 0x3297 && hs <= 0x3299) ||
                (hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030 ||
                    hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b ||
                    hs === 0x2b50)
            )
        }
    }
}
// 将emoji转码
export const utf16toEntities = (str) => {
    var patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则
    str = str.replace(patt, (char) => {
        var H, L, code
        if (char.length === 2) {
            H = char.charCodeAt(0)
            // 取出高位
            L = char.charCodeAt(1)
            // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00
            // 转换算法
            return '&#' + code + ';'
        } else {
            return char
        }
    })
    return str
}
// 字符串转成emoji
export const entitiesToUtf16 = (str) => {
    if (!str) return ''
    return str.replace(/&#(\d+);/g, function (match, dec) {
        const H = Math.floor((dec - 0x10000) / 0x400) + 0xD800
        const L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00
        return String.fromCharCode(H, L)
    })
}
// 阿拉伯数字转中文数字
export const num2cn = (num) => {
    var AA = Array.from(['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'])
    var BB = Array.from(['', '十', '百', '千', '万', '亿', '点', ''])
    var a = ('' + num).replace(/(^0*)/g, '').split('.')
    var k = 0
    var re = ''
    for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
        case 0:
            re = BB[7] + re
            break
        case 4:
            if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0])) { re = BB[4] + re }
            break
        case 8:
            re = BB[5] + re
            BB[7] = BB[5]
            k = 0
            break
        }
        if (k % 4 === 2 && a[0].charAt(i + 2) !== 0 && a[0].charAt(i + 1) === 0) re = AA[0] + re
        if (a[0].charAt(i) !== 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re
        k++
    }
    if (a.length > 1) {
        re += BB[6]
        for (let i1 = 0; i1 < a[1].length; i1++) re += AA[a[1].charAt(i1)]
    }
    return re
}
/**
 * 洗牌算法
 */
export const shuffle = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
        const rIndex = Math.floor(Math.random() * (i + 1))
        // 打印交换值
        // console.log(i, rIndex);
        const temp = arr[rIndex]
        arr[rIndex] = arr[i]
        arr[i] = temp
    }
    return arr
}

// 格式化倒计时，秒为单位 返回形式 hh:mm:ss :为分隔符
export const formatCountDown = (time, hoursplit = '', minutesplit = '', secondsplit = '') => {
    const hours = moment.duration(time, 'seconds').hours() > 0 ? moment.duration(time, 'seconds').hours() : ''
    const minutes = moment.duration(time, 'seconds').minutes() > 0 ? moment.duration(time, 'seconds').minutes() : ''
    const seconds = moment.duration(time, 'seconds').seconds() > 0 ? moment.duration(time, 'seconds').seconds() : 0
    // secondsplit = (hours && seconds) ? secondsplit : 's'
    return formatTime(minutes, minutesplit) + formatTime(seconds, secondsplit)
}

// 格式化时间
export const formatTime = (diffTime, split) => {
    const time = diffTime || 0
    return time > 9 ? (time + '' + split) : '0' + time + split
}

// 防抖
export function myDebounce (fn, delayTime) {
    let timer = null
    return function () {
        if (timer) clearTimeout(timer)
        const _this = this
        const _arguments = arguments
        timer = setTimeout(() => {
            fn.apply(_this, _arguments)
        }, delayTime)
    }
}

// 节流
export function myThrottle (fn, delayTime) {
    let timer = null
    return function () {
        if (timer) return
        const _this = this
        const _arguments = arguments
        fn.apply(_this, _arguments)
        timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
        }, delayTime)
    }
}
