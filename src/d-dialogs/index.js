// 自动识别d-dialogs目录并导出组件列表
const files = require.context('./', true, /\.vue$/)
export default files.keys().reduce((obj, key) => {
    obj[key.split('/').pop().split('.')[0]] = false
    return obj
}, {})
