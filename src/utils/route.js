/**
 * 监听页面隐藏/复现
 * @param { Function } cb(isValidJump是否有效跳出: Boolean, duration跳出时长: Number) 页面复现
 * @param { Number } safeBuffer 缓冲时间，单位s，超过该时间才算有效跳出
 */
export const oncePageResume = (cb, safeBuffer = 3) => {
    // {safeBuffer} 秒后,如果页面没有显示，才认为是有效的跳转
    // 有效跳转后，监听页面show事件，执行cb
    uni.$once('pageHide', () => {
        let isValidJump = false
        const hideTime = Date.now()
        const timer = setTimeout(() => {
            isValidJump = true
            uni.$once('pageShow', () => {
                const duration = Date.now() - hideTime
                cb(isValidJump, duration)
            })
        }, safeBuffer * 1000)

        uni.$once('pageShow', () => {
            if (isValidJump) return /* 页面重现时，已经是有效跳转 */
            // 再加一个判断，如果1s内又跳走了，证明是成功的跳转
            let quickHide = false
            setTimeout(() => {
                if (quickHide) return
                clearTimeout(timer) /* 页面重现时，非有效跳转，清除定时器 */
                const duration = Date.now() - hideTime
                cb(isValidJump, duration)
            }, 1500)
            uni.$once('pageHide', () => {
                quickHide = true
            })
        })
    })
}
/**
 * 监听页面隐藏/复现
 * @param { Function } cb(isValidJump是否有效跳出: Boolean, duration跳出时长: Number) 页面复现
 * @param { Number } safeBuffer 缓冲时间，单位s，超过该时间才算有效跳出
 */
export const oncePageHide = (cb, safeBuffer = 3) => {
    // {safeBuffer} 秒后,如果页面没有显示，才认为是有效的跳转
    // 有效跳转后，监听页面show事件，执行cb
    uni.$once('pageHide', () => {
        let isValidJump = false
        const timer = setTimeout(() => {
            isValidJump = true
            cb()
        }, safeBuffer * 1000)

        uni.$once('pageShow', () => {
            if (isValidJump) return /* 页面重现时，已经是有效跳转 */
            clearTimeout(timer) /* 页面重现时，非有效跳转，清除定时器 */
        })
    })
}
