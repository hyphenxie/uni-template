// 简单判断驼峰命名，大写开头，只含字母+数字
function isCamelCase (name) {
    const reg = /^[A-Z][A-Za-z0-9]+$/g
    return reg.test(name)
}

module.exports = {
    isCamelCase
}
