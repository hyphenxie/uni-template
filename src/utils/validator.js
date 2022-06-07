/** 手机号码校验 */
export const isMobile = str => {
    const checkstr = /^1[0-9]{10}$/
    return checkstr.test(str)
}
